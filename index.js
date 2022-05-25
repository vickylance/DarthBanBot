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

  function check(obj, str) {
    let checker = finalOptions.wholeWords ? "indexOf" : "includes";
    if (
      checker === "indexOf" &&
      obj &&
      new RegExp("\\b" + str + "\\b").test(obj)
    ) {
      return true;
    }
    if (checker === "includes" && obj?.[checker](str)) {
      return true;
    }
    return false;
  }

  if (
    (finalOptions.caseSensitive && check(message.content, str)) ||
    (!finalOptions.caseSensitive && check(message.content?.toLowerCase(), str))
  )
    return true;

  for (let embed of message.embeds) {
    console.log("title: ", embed.title);
    if (
      (finalOptions.caseSensitive &&
        ((finalOptions.author && check(embed.author?.name, str)) ||
          (finalOptions.description && check(embed.description, str)) ||
          (finalOptions.footer && check(embed.footer?.text, str)) ||
          (finalOptions.title && check(embed.title, str)))) ||
      (!finalOptions.caseSensitive &&
        ((finalOptions.author &&
          check(embed.author?.name?.toLowerCase(), str)) ||
          (finalOptions.description &&
            check(embed.description?.toLowerCase(), str)) ||
          (finalOptions.footer &&
            check(embed.footer?.text.toLowerCase(), str)) ||
          (finalOptions.title && check(embed.title?.toLowerCase(), str))))
    )
      return true;

    if (finalOptions.fields)
      for (let field of embed.fields) {
        if (
          (finalOptions.caseSensitive &&
            [field.name, field.value].includes(str)) ||
          (!finalOptions.caseSensitive &&
            [field.name.toLowerCase(), field.value.toLowerCase()].includes(str))
        ) {
          return true;
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
