const { resolve } = require("app-root-path");
const { urlencoded } = require("body-parser");
const { url } = require("inspector");
const { argv } = require("process");
const { response } = require("./server.js");

const express = require("express"),
  request = require("request"),
  crypt = require("./kripto.js"),
  router = express.Router(),
  db = require("./db.js"),
  jwt = require("./jwt/jwt"),
  fs = require("fs"),
  appConfig = require("./config/appConfig.js");

// --------------------------------------------------

let kataloziZdravstvenoOsiguranje = [];

let ISVUdata = {};
ISVUdata.getData = async function (req, res) {
  ISVUPodaci = await getISVUData(req, res);
};

async function getISVUData(req, res) {
  if (!req) {
    req = [];
  }
  if (!res) {
    res = [];
  }

  // Postavljanje serverskih opcija za poziv api-a
  let serverOptions;
  serverOptions = {
    headers: {
      Authorization:
        appConfig.ISVUconfig.AuthorizationHeader +
        " " +
        Buffer.from(
          appConfig.ISVUconfig.ISVUUsername +
          ":" +
          appConfig.ISVUconfig.ISVUPassword
        ).toString("base64"),
      Accept: appConfig.ISVUconfig.DefaultRequestHeader,
      "Accept-Encoding": "gzip, deflate",
      "Accept-Language": "hr",
      "Accept-Charset": "UTF-8",
      "content-type": "application/json",
    },
  };

}

function someOtherFunction(result = [], theBeginning) {
  return new Promise(async (resolve, reject) => {

    
    request.get(theBeginning, { headers: { Authorization: `Basic ${Buffer.from("eduplan.mfs:ijog151esef148").toString("base64")}` } }, async (err, response, body) => {
      if (err) {
        resolve({ err: err });
      }
      
      if (response && response.statusCode == 200) {
        try {
          data = JSON.parse(response.body);
        } catch (e) {
          console.log("false json"+e);
        }
        let current = Object.keys(data._links).map((key) => data._links[key]);
          result.push(current);
        let visited=[];
         
          await promiser(current,visited,result);
          console.log("visited");
          console.log(visited);
        resolve(result);
      }
      resolve({ err: response });
    });
  });
}

const promiser = async (current,visited,result = []) => {
  
  return new Promise(async resolve =>{
  for await (const [key, value] of Object.entries(current)) {
    if (typeof value === "object" && value !== null) {
      if (!value.href.includes(".html") && !visited.includes(value.href)) {
         await recurse(result,visited,JSON.stringify(value.href).replace(/['"]+/g, ""));
      }

    }
  }
  resolve(visited,current,result);
});
}
const recurse = async (result,amount = [], link = {}) => {
  return new Promise(async resolve =>{
  if (!amount.includes(link)) {
    amount.push(link);
    let povratIzCalLink = await callLink(link);
    result.push(povratIzCalLink);
    let duck = " nyan ";
    await recurse(result, amount, link);
  }
  resolve(amount, result);
});
}

function callLink(link) {
  let data = null;
  console.log("usa u callLink");
  return new Promise(resolve => {
    request.get(link, { headers: { Authorization: `Basic ${Buffer.from("eduplan.mfs:ijog151esef148").toString("base64")}` } }, (err, response, body) => {
      if (err) {
        resolve({ err: err });
      }
      if (response && response.statusCode == 200) {
        try {
          data = JSON.parse(response.body);
        } catch (e) {
          return resolve({ err: "invalid json!" });
        }
        resolve(data);
      }
      resolve({ err: response });
    });
  });
}

router.get("/testni", async (req, res) => {
  let testVar = null;
  let cnt = 0;
  let amount = [];

  try {
    testVar = await someOtherFunction(amount,"https://www.isvu.hr/apiproba/vu/63/nastavniprogram");
    res.send(amount);
    console.log("testVar : ", amount);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
});

router.get("/getHierarchicalApi", async (req, res) => {
  let hieApi = null;
  let visited = [];
  console.log("NEW CYCLE");

  try {
    hieApi = await getHieApi(
      // 1,
      visited,
      "https://www.isvu.hr/apiproba/vu/63/nastavniprogram"
    );
    res.send(hieApi);
    console.log("hieApi : ", hieApi);


  } catch (error) {
    return res.status(500).send({ error: error });
  }
});

router.get("/test", function (req, res) {
  res.send({ message: "OK" });
});

module.exports = { ISVUdata: ISVUdata, router: router };
