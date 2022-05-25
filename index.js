const { Client, Intents, MessageEmbed } = require("discord.js");

const DarthBotToken = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
client.on("ready", function (e) {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.login(DarthBotToken);

function findInMessage(message, target, options) {
  const defaultOptions = {
    caseSensitive: false,
    wholeWords: false,
    author: true,
    description: true,
    footer: true,
    title: true,
    fields: true,
  };
  const finalOptions = {
    ...defaultOptions,
    ...options,
  };
  if (!target || !message) return null;
  let str = finalOptions.caseSensitive ? target : target.toLowerCase();

  function check(str, strToCheck) {
    if (!str || !strToCheck) return false;

    let { wholeWords, caseSensitive } = finalOptions;
    if (!caseSensitive) {
      strToCheck = strToCheck.toLowerCase();
    }
    if (wholeWords && new RegExp("\\b" + strToCheck + "\\b").test(str)) {
      return true;
    }
    if (!wholeWords && str.includes(strToCheck)) {
      return true;
    }
    return false;
  }

  if (check(message.content, str)) {
    return true;
  }

  for (let embed of message.embeds) {
    if (
      (finalOptions.author && check(embed.author?.name, str)) ||
      (finalOptions.description && check(embed.description, str)) ||
      (finalOptions.footer && check(embed.footer?.text, str)) ||
      (finalOptions.title && check(embed.title, str))
    ) {
      return true;
    }

    if (finalOptions.fields) {
      for (let field of embed.fields) {
        if (check(`${field.name} ${field.value}`, str)) {
          return true;
        }
      }
    }
  }

  return false;
}

client.on("message", function (msg) {
  if (
    findInMessage(msg, "darth micro") ||
    findInMessage(msg, "darthmicro") ||
    findInMessage(msg, "DM", { caseSensitive: true, wholeWords: true }) ||
    findInMessage(msg, "𝔻𝕄", { caseSensitive: true, wholeWords: true })
  ) {
    const embed = new MessageEmbed()
      .setTitle("He is noob don't mention him")
      .setImage(
        "https://c.tenor.com/MTtxDwRKF00AAAAC/maa-chod-denge-talking.gif"
      );

    msg.reply({ embeds: [embed] });
  }
});
