const qrcode = require("qrcode-terminal");
const { Chat } = require("whatsapp-web.js");
const { Client, MessageMedia } = require("whatsapp-web.js");

const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  let mess = message.body.split(" ");
  if (mess[0] == "#help") {
    b =
      "#help" +
      ": Display this help message" +
      "\n" +
      "#gpt <query>" +
      " : Gives result of ChatGPT" +
      "\n" +
      "#img <topic>" +
      ": Display a image" +
      "\n" +
      "#py <code>" +
      ": Give Output of Python code" +
      "\n" +
      "#rj" +
      ": Give Random Joke" +
      "\n";
    message.reply(b);
  } else if (mess[0] == "#gpt") {
    a = message.body.substring(5);
    const url = "https://you-chat-gpt.p.rapidapi.com/";

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "030231b335msh850e556e125bff6p186a2ejsndc5721c390d5",
        "X-RapidAPI-Host": "you-chat-gpt.p.rapidapi.com",
      },
      body: JSON.stringify({ question: a, max_response_time: 30 }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        message.reply(json["answer"]);
      })
      .catch((err) => {
        console.error("error:" + err);

        message.reply(err);
      });
  } else if (mess[0] == "#py") {
    a = message.body.substring(4);
    const encodedParams = new URLSearchParams();
    encodedParams.append("LanguageChoice", "5");
    encodedParams.append("Program", a);

    const url = "https://code-compiler.p.rapidapi.com/v2";

    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "030231b335msh850e556e125bff6p186a2ejsndc5721c390d5",
        "X-RapidAPI-Host": "code-compiler.p.rapidapi.com",
      },
      body: encodedParams,
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json["Errors"] == null) {
          message.reply(json["Result"]);
        } else {
          message.reply(json["Errors"]);
        }
      })
      .catch((err) => {
        console.error("error:" + err);
        message.reply(err);
      });
  } else if (mess[0] == "#img") {
    a = message.body.substring(5);
    let b =
      "https://api.unsplash.com/search/photos?client_id=sa4gkkgSJAJh181JObX4qFvpEbtCfRBpjkWzDfBTe28&page=1&query=";
    b = b + a;
    fetch(b, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then(function (serverPromise) {
        serverPromise
          .json()
          .then(async function (j) {
            console.log(
              j["results"][Math.floor(Math.random() * j["results"].length)][
                "urls"
              ]["full"]
            );
            let c =
              j["results"][Math.floor(Math.random() * j["results"].length)][
                "urls"
              ]["full"];
            const media = await MessageMedia.fromUrl(c);

            message.reply(media);
          })
          .catch(function (e) {
            console.log(e);
            message.reply("Not Found");
          });
      })
      .catch(function (e) {
        console.log(e);
        message.reply("Not Found");
      });
  } else if (mess[0] == "#rj") {
    const url = "https://random-stuff-api.p.rapidapi.com/joke/random";

    const options = {
      method: "GET",
      headers: {
        Authorization: "7kdjkjlGLbfD",
        "X-RapidAPI-Key": "030231b335msh850e556e125bff6p186a2ejsndc5721c390d5",
        "X-RapidAPI-Host": "random-stuff-api.p.rapidapi.com",
      },
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        message.reply(json["message"]);
      })
      .catch((err) => console.error("error:" + err));
  }
});
client.initialize();
