const { MessageEmbed, WebhookClient } = require("discord.js");
const MAX_MESSAGE_LENGTH = 72;

module.exports.send = (id, token, repo, url, commits, size, pusher) =>
  new Promise((resolve, reject) => {
    let client;
    const username = repo.replace(/(discord)/gi, "******");
    console.log("Preparing Webhook...");
    try {
      client = new WebhookClient({
        id: id,
        token: token,
      });
      client
        .send({
          username: username,
          embeds: [createEmbed(url, commits, size, pusher)],
        })
        .then(() => {
          console.log("Successfully sent the message!");
          resolve();
        }, reject);
    } catch (error) {
      console.log("Error creating Webhook");
      reject(error.message);
      return;
    }
  });

function createEmbed(url, commits, size, pusher) {
  console.log("Constructing Embed...");
  console.log("Commits:");
  console.log(commits);
  if (!commits) {
    console.log("No commits, skipping...");
    return;
  }
  const latest = commits[0];
  return new MessageEmbed()
    .setColor(16733140)
    .setAuthor({
      name: `${pusher} heeft ${size} update${size === 1 ? "" : "s"} toegevoegd`,
      iconURL: `https://github.com/${pusher}.png?size=64`,
    })
    .setTitle("MaarsseveenRP Changelog")
    .setThumbnail(
      "https://media.discordapp.net/attachments/818091538289524776/1198614646790311936/Maarsseveenlogo.png?ex=65e475e0&is=65d200e0&hm=48aea39383b31b2d476058c10456e7dac485f80b1e2c1db78d329708863a6842&=&format=webp&quality=lossless&width=671&height=671"
    )
    .setDescription(`${getChangeLog(commits, size)}`)
    .setFooter({
      text: "MaarsseveenRP Changelogs",
      iconURL:
        "https://media.discordapp.net/attachments/818091538289524776/1198614646790311936/Maarsseveenlogo.png?ex=65e475e0&is=65d200e0&hm=48aea39383b31b2d476058c10456e7dac485f80b1e2c1db78d329708863a6842&=&format=webp&quality=lossless&width=671&height=671",
    })
    .setTimestamp(Date.parse(latest.timestamp));
}

function getChangeLog(commits, size) {
  let changelog = "";
  for (let i = 0; i < Math.min(commits.length, 10); i++) {
    const commit = commits[i];
    if (!commit.message.includes("Merge")) {
      const message =
        commit.message.length > MAX_MESSAGE_LENGTH
          ? commit.message.substring(0, MAX_MESSAGE_LENGTH) + "..."
          : commit.message;
      changelog += `— ${message}\n`;
    }
  }

  if (commits.length > 10) {
    changelog += `+ ${commits.length - 10} meer...\n`;
  }

  return changelog;
}
