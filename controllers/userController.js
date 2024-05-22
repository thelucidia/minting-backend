require('dotenv').config();
const nodemailer = require("nodemailer");
const Twitter = require('twitter');
const TelegramBot = require("node-telegram-bot-api");
const { Client, GatewayIntentBits } = require("discord.js");
const userService = require("../services/userService");

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  bearer_token: process.env.TWITTER_BEARER_TOKEN,
});
const bot = new TelegramBot(process.env.TEL_BOT_TOKEN, { polling: true });
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.login(process.env.DIS_BOT_TOKEN);

// In-memory storage for simplicity
let verificationCodes = {};

// Mail transporter setup (using nodemailer with a dummy SMTP service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "auth@lucidia.io",
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Endpoint to generate and send a code
const sendCode = async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(1000 + Math.random() * 9000);
  verificationCodes[email] = code; // Store code
  try {
    const mailOptions = {
      from: "auth@lucidia.io",
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is : ${code}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Failed to send email" });
  }
};

const verifyCode = (req, res) => {
  const { email, code, wallet } = req.body;
  const validCode = verificationCodes[email];
  try {
    if (parseInt(code) === validCode) {
      userService.create({ email, wallet })
      delete verificationCodes[email]; // Remove code after verification
      res.json({ msg: "Verification successful" });
    } else {
      res.json({ msg: "Verification failed" });
    }
  } catch (error) {
    console.log(error);
  }
};

const checkFollowingTwitter = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'username is required' });
  }

  try {
    const followingList = await twitterClient.get('friends/list', {
      screen_name: 'lucidia_io'
    });
    console.log(followingList);
  } catch (error) {
    console.log(error);
  }
}

const checkMembershipForTelegram = async (req, res) => {
  const { username } = req.body;

  try {
    const admins = await bot.getChatAdministrators(process.env.TEL_GROUP_ID);
    console.log(admins);
    const adminMember = admins.find(admin => admin.user.username === username);
    if (adminMember) {
      return res.json({ membership: "Admin" });
    }

    const memberStatus = await bot.getChatMember(groupId, username);
    if (['member', 'administrator', 'creator'].includes(memberStatus.status))
      return res.json({ membership: memberStatus.status });

    res.json({ membership: 'none' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while checking the membership of Telegram' });
  }
}

const checkMembershipForDiscord = async (req, res) => {
  const { username } = req.body;

  try {
    const guild = await client.guilds.cache.get(process.env.DIS_SERVER_ID);
    const members = await guild.members.search({ query: username });
    const member = members.find(member => member.user.username === username);

    if (member) {
      res.json({ isMember: true });
    } else {
      res.json({ isMember: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while checking the membership of Discord' });
  }
}

module.exports = {
  sendCode,
  verifyCode,
  checkFollowingTwitter,
  checkMembershipForTelegram,
  checkMembershipForDiscord
};
