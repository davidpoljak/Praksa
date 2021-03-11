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

    console.log("\nAll your bases are belong to us\n");
    // recurse(result, ducky[item]);
    request.get(theBeginning, { headers: { Authorization: `Basic ${Buffer.from("eduplan.mfs:ijog151esef148").toString("base64")}` } }, async (err, response, body) => {
      if (err) {
        resolve({ err: err });
      }
      // console.log(response);
      if (response && response.statusCode == 200) {
        try {
          data = JSON.parse(response.body);
        } catch (e) {
          console.log("false json"+e);
        }
        let current = Object.keys(data._links).map((key) => data._links[key]);
          result.push(current);
        let visited=[];
          // console.log("step 6:");
        // here is the deal,u onin mini funkcijama ovo je samo jedan poziv ja vamo iman petlju :/ znaci 4 poziva,vjv prvi proguta sinhrono ostale cucne
        //al ...ispis je za sada ok,so keep this in mind
        //it dont do what i want it to do,prvi komad odradi uredno,kad ode na sljedeci van definiranoga cooc
      
        // for (const [key, value] of Object.entries(current)) {
        //     // console.log(key, value);
        //     if (typeof value === "object" && value !== null) {
        //       if (!value.href.includes(".html") && !visited.includes(value.href)) {
        //         // console.log("\nSAMO VRTI" + JSON.stringify(value.href) + "\n");
        //         // visited.push(JSON.stringify(value.href).replace(/['"]+/g, ""));
        //          recurse(0,visited,JSON.stringify(value.href).replace(/['"]+/g, ""));
        //       }

        //     }
        //   }
          await shitsNgiggles(current,visited,result);
          console.log("visited");
          console.log(visited);
        resolve(result);
      }
      resolve({ err: response });
    });
  });
}

const shitsNgiggles = async (current,visited,result = []) => {
  
  return new Promise(async resolve =>{
  for await (const [key, value] of Object.entries(current)) {
    // console.log(key, value);
    if (typeof value === "object" && value !== null) {
      if (!value.href.includes(".html") && !visited.includes(value.href)) {
        // console.log("\nSAMO VRTI" + JSON.stringify(value.href) + "\n");
        // visited.push(JSON.stringify(value.href).replace(/['"]+/g, ""));
         await recurse(result,visited,JSON.stringify(value.href).replace(/['"]+/g, ""));
        //  recurse(result,visited,JSON.stringify(value.href).replace(/['"]+/g, ""));
      }

    }
  }
  resolve(visited,current,result);
});
  // return visited,current,result;
}
//on sad,by the grace of the omnisiah,guta sve async cak dvi razine,great success
//request get je bija separate nadlezna funkcija bogu fala nije moga rec da je scope samo unutrar jedne ne obje
//glavna poziva shitsngiggles,on obradi originalne 4,
//svaka od te cetri poziva recrse koji ukoliko nema visited potrpa link i body napuni samo neradi nista dalje
//recurse triba ili uc u shitsngiggles pa napravit isto 
//ili ukomponirat neku for async petlju za cupanje daljnjih json fileova 
//potrebo razradit mapiranje odredjenih objekata zasad samo cupa cili body 
//ugl recurse triba do kraja pokusaja derat request getove priko call linka al za svaki od elemenata unutrar dobijenog sljedeceg jsona
//ako vrati nista->ccuc
//preformulirat shits n giggles da primi json ,result ,visited,ili samo link....
//ili samo link daaa jer priko linka ce iskpat za svaki korak

const recurse = async (result,amount = [], link = {}) => {
  // ... function does some work ...
  // await someOtherFunction(amount)
  return new Promise(async resolve =>{
    console.log("\nTHIS IS THE WAY"+link+"\n");
  // ... function does some more work after returning from await ...
  if (!amount.includes(link)) {
    amount.push(link);
    // result++;
    console.log("dance monkey");
    let povratIzCalLink = await callLink(link);
    // console.log("callLink: "+JSON.stringify(povratIzCalLink));
    result.push(povratIzCalLink);
    let duck = " nyan ";
    // amount.push(duck);
    await recurse(result, amount, link);
  }
  // return amount, result;
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
    // console.log("visited", visited);
    // console.log("amass", amass);


  } catch (error) {
    return res.status(500).send({ error: error });
  }
});

router.get("/test", function (req, res) {
  res.send({ message: "OK" });
});

module.exports = { ISVUdata: ISVUdata, router: router };
// const { resolve } = require('app-root-path');
// const { count } = require('console');
// const { response } = require('./server.js');

// const express = require('express'),
//   request = require('request'),
//   crypt = require('./kripto.js'),
//   router = express.Router(),
//   db = require('./db.js'),
//   jwt = require('./jwt/jwt'),
//   fs = require('fs'),
//   appConfig = require('./config/appConfig.js');

// // --------------------------------------------------

// let kataloziZdravstvenoOsiguranje = [];

// let ISVUdata = {};
// ISVUdata.getData = async function (req, res) {
//   ISVUPodaci = await getISVUData(req, res);
// }

// async function getISVUData(req, res) {
//   if (!req) {
//     req = [];
//   }
//   if (!res) {
//     res = [];
//   }

//   // Postavljanje serverskih opcija za poziv api-a
//   let serverOptions;
//   serverOptions = {
//     headers: {
//       "Authorization": appConfig.ISVUconfig.AuthorizationHeader + ' ' + Buffer.from(appConfig.ISVUconfig.ISVUUsername + ':' + appConfig.ISVUconfig.ISVUPassword).toString("base64"),
//       "Accept": appConfig.ISVUconfig.DefaultRequestHeader,
//       "Accept-Encoding": 'gzip, deflate',
//       "Accept-Language": 'hr',
//       "Accept-Charset": 'UTF-8',
//       "content-type": "application/json"
//     }
//   };

//   // Dohvat kataloga zdravstvenog osiguranja
//   try {
//     kataloziZdravstvenoOsiguranje = await getKataloziZdravstvenoOsiguranje(req, res, serverOptions);
//     // console.log('kataloziZdravstvenoOsiguranje: ', kataloziZdravstvenoOsiguranje);
//     // console.log(kataloziZdravstvenoOsiguranje);
//   } catch (error) {
//     console.log("Error: ", error);
//     kataloziZdravstvenoOsiguranje = [];
//   }
// }

// // --------------------------------------------------------------------------
// // Dohvat kataloga zdravstvenog osiguranja
// // --------------------------------------------------------------------------
// async function getKataloziZdravstvenoOsiguranje(req, res, serverOptions) {
//   return new Promise(function (resolve, reject) {
//       try {
//         serverOptions.uri = appConfig.ISVUconfig.PrefixISVUApi + appConfig.ISVUconfig.ISVUOznakaFakulteta + "/katalog/zdravstvenoosiguranje";
//         request.get(serverOptions, async function (err, response, body) {
//           if (response) {
//             if (response.statusCode === 200) {
//               data = JSON.parse(response.body);
//               let dataRes = [];
//               if (data._embedded && data._embedded.zdravstvenaOsiguranja) {
//                 data._embedded.zdravstvenaOsiguranja.forEach(element => {
//                   let el = {};
//                   el.sifra = element.sifra;
//                   el.opis = element.opis;
//                   dataRes.push(el);
//                 });
//               }
//               resolve(data);
//             } else {
//               console.log("Error: ", response.request.href, " - ", response.statusCode, " - ", response.body);
//             }
//           }
//         });
//       } catch (error) {
//         console.log("Request error: ", error);
//       }
//     });
// }

// function getHierarchicalApi3(visited = [], link) {



//   return new Promise((resolve, reject) => {
//     console.log("step 1:");
//     request.get(
//       "https://www.isvu.hr/apiproba/vu/63/nastavniprogram",
      
//       {
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             "eduplan.mfs:ijog151esef148"
//           ).toString("base64")}`,
//         },
//       },
//       (err, response, body) => {
//         console.log("step 2:");

//         if (err) {
           
//            reject(err + "patkica");
//         }
//         console.log(response.statusCode);

//         if (response.statusCode == 200) {
//           console.log("step 4:");

//           visited.push("https://www.isvu.hr/apiproba/vu/63/nastavniprogram");
//           data = JSON.parse(response.body);
//           let dataRes = [];
//           console.log("step 5:");

//           let current = Object.keys(data._links).map((key) => data._links[key]);
//           dataRes.push(current);
//           console.log("step 6:");

//           for (const [key, value] of Object.entries(current)) {
//             console.log(key, value);
//             if (!value.href.includes(".html") && !visited.includes(value.href))
//               recursionFunction(value, visited, dataRes);
//           }
//           console.log("step 7:");
//           console.log("ovo je predpredzadnji visited"+visited)
//           resolve(visited);
//         }
//         reject({ err: response + "nije dobro" });
//       }
//     );
//   });

// }

// async function recursionFunction(newUrl, visited = [], result = []) {
//   console.log("step 8:");
//   console.log("NOVI URL JE:" + newUrl.href);
//   const duck = visited;
//   return new Promise((resolve, reject) => {
//     request.get(
//       (new URL(newUrl.href)).href,
//       {
//         headers: {
//           Authorization: `Basic ${Buffer.from(
//             "eduplan.mfs:ijog151esef148"
//           ).toString("base64")}`,
//         },
//       },
//       (err, response, body) => {
//         if (err) {
//           console.log("duckup");
//           console.log(err);
//           reject(err);
//         }
//         // console.log("step 9:");
//         // console.log("status report:" + response.statusCode);
//         // console.log("falivena stranica:" + newUrl.href);
//         // console.log(body);


//         if (response.statusCode == 200) {
//           // console.log("step 10:");

//           visited.push((new URL(newUrl.href)).href);
//           console.log("novi url je: "+(new URL(newUrl.href)).href);
//           //console.log("vizitano je +"+visited);
//           try {
//             data = JSON.parse(response.body);
//           } catch (e) {
//             reject({ err: response });
//             return false;
//           }
//           // data = JSON.parse(response.body);
//           // let dataRes = [];
//           let current=new Map();
//           if(newUrl.href == "https://www.isvu.hr/apiproba/vu/63/nastavniprogram/nastavniprogramuakadmeskojgodini"){
//             data._embedded.akademskeGodine.forEach(e => {
//               current = Object.keys(e._links).map((key) => e._links[key]);
//               result.push(current);
//               for (const [key, value] of Object.entries(current)) {
//                 // console.log(key, value);
//                 if (!value.href.includes(".html") && !visited.includes(value.href))
//                 // await(recursionFunction(value, visited, result));
    
//                 {
                  
//                   if (typeof value === "string") {
//                     recursionFunction(JSON.stringify(value), visited, result);
//                   }
//                   else
//                     duck.push((recursionFunction(value, visited, result)));
//                 }
//               }
//               console.log("ovo je predzadnji visited"+visited)
//               resolve(result);
//               })
            
            
//           }
//           else{
//             current = Object.keys(data._links).map((key) => data._links[key]);
//             result.push(current.value);
//             console.log("result je +"+result.key);
//           }

          
//           for (const [key, value] of Object.entries(current)) {
//             if (!value.href.includes(".html") && !visited.includes(value.href))
//             {
//               if (value instanceof Array) {
//                 for (item in value) {
//                 }
//               }
//               if (typeof value === "string") {
//                 recursionFunction(JSON.stringify(value), visited, result);
//               }
//               else{
//                 duck.push((recursionFunction(value, visited, result)));
//                 //console.log("duck je +"+duck);
//               }
//             }
//           }
//           //console.log("ovo je zadnji visited"+visited)
//           resolve(result);
//         }
        
//         reject({ err: response } + "big boo boo");
//         // console.log("ovo nebi tribalo bit na ekranu");
//         // console.log(response.href);
//         // resolve({ err: response });
//       }
//     );
//   });
// }

// router.get('/getHierarchicalApi', async (req, res) => {
//   let hieApi = null;
//   try {
//     hieApi = await getHierarchicalApi3();
//     res.send(hieApi);
    
//     console.log('hieApi : ', hieApi);
//   } catch (error) {
//     return res.status(500).send({ error: error });
//   }
// });
// router.get('/test', function (req, res) {
//   res.send({ "message": "OK" });
// });

// module.exports = { ISVUdata: ISVUdata, router: router };

/*
"_links":
  {
    "self":
          {
            "href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/nastavniprogramuakadmeskojgodini"
          }
    ,"profile":
          {
            "href":"https://www.isvu.hr/apiproba/dokumentacija/v2-hal/linkovi/nastavniprogram/nastavniprogramuakademskimgodinama/index.html"
          }
  }
,"_embedded":
  {
    "akademskeGodine":
    [
      {
        "akademskaGodina":2020,
          "_links":
            {
              "nastavniprogram_studiji":
                {
                  "href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/studij/akademskagodina/2020"
                }
              ,"nastavniprogram_obrazovniprogrami":
                {
                  "href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/obrazovniprogram/akademskagodina/2020"
                }
              ,"nastavniprogram_izvodjaci":
                {
                  "href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/izvodjac/akademskagodina/2020"
                }
              ,"nastavniprogram_predmeti":
                {
                  "href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2020"
                }
              ,"nastavniprogram_predavanjeizbornihpredmeta":
                {
                  "href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predavanjeizbornihpredmeta/akademskagodina/2020"}
                }
    }



    {"_links":
    {"self":
    { "href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005"},
      "profile":{"href":"https://www.isvu.hr/apiproba/dokumentacija/v2-hal/linkovi/nastavniprogram/predmeti/index.html"}
    },"_embedded":{"predmeti":
    [{"sifra":33089,"naziv":"Medicinska fizika
i biofizika",
"_links":{
  "nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33089"}
  ,"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33089"}
}
}
  ,{"sifra":33090,"naziv":"Medicinska biologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33090"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33090"}}},{"sifra":33091,"naziv":"Histologija i embriologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33091"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33091"}}},{"sifra":33092,"naziv":"Uvod u medicinu i povijest medicine","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33092"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33092"}}},{"sifra":33093,"naziv":"Socijalna medicina","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33093"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33093"}}},{"sifra":33094,"naziv":"Psihološka medicina","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33094"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33094"}}},{"sifra":33095,"naziv":"Prva pomoć","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33095"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33095"}}},{"sifra":33096,"naziv":"Medicinski engleski","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33096"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33096"}}},{"sifra":33097,"naziv":"Anatomija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33097"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33097"}}},{"sifra":33100,"naziv":"Miologija u teretani","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33100"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33100"}}},{"sifra":33377,"naziv":"Anatomija i fiziologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33377"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33377"}}},{"sifra":33379,"naziv":"Biofizika, biokemija i osnove radiologije","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33379"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33379"}}},{"sifra":33381,"naziv":"Dijetetika","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33381"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33381"}}},{"sifra":33384,"naziv":"Filozofija i bioetika u zdravstvenoj njezi","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33384"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33384"}}},{"sifra":33385,"naziv":"Komunikacijske vještine","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33385"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33385"}}},{"sifra":33386,"naziv":"Mikrobiologija s parazitologijom","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33386"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33386"}}},{"sifra":33387,"naziv":"Osnove zdravstvene njege","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33387"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33387"}}},{"sifra":33389,"naziv":"Proces zdravstvene njege","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33389"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33389"}}},{"sifra":33390,"naziv":"Patofiziologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33390"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33390"}}},{"sifra":33391,"naziv":"Strani jezik","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33391"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33391"}}},{"sifra":33392,"naziv":"Epidemiologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33392"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33392"}}},{"sifra":33393,"naziv":"Informatizacija i administracija u zdravstvenoj njezi","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33393"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33393"}}},{"sifra":33394,"naziv":"Patologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33394"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33394"}}},{"sifra":33395,"naziv":"Zdravstvena psihologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33395"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33395"}}},{"sifra":33458,"naziv":"Anatomija s histologijom","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33458"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33458"}}},{"sifra":33459,"naziv":"Biomehanika","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33459"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33459"}}},{"sifra":33460,"naziv":"Fizika","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33460"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33460"}}},{"sifra":33461,"naziv":"Fizioterapijska procjena","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33461"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33461"}}},{"sifra":33462,"naziv":"Klinička praksa I","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33462"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33462"}}},{"sifra":33463,"naziv":"Fiziologija s patofiziologijom","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33463"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33463"}}},{"sifra":33464,"naziv":"Higijena i socijalna medicina","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33464"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33464"}}},{"sifra":33465,"naziv":"Klinička kineziologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33465"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33465"}}},{"sifra":33466,"naziv":"Osnove motoričkih transformacija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33466"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33466"}}},{"sifra":33467,"naziv":"Osnove zdravstvene njege","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33467"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33467"}}},{"sifra":33468,"naziv":"Psihički razvoj čovjeka","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33468"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33468"}}},{"sifra":33469,"naziv":"Engleski jezik","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33469"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33469"}}},{"sifra":33470,"naziv":"Uvod u fizioterapiju","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33470"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33470"}}},{"sifra":33471,"naziv":"Zdravstvena psihologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33471"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33471"}}},{"sifra":33472,"naziv":"Gerontologija","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33472"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33472"}}},{"sifra":33473,"naziv":"Medicinska informatika","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33473"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33473"}}},{"sifra":33523,"naziv":"Kliničke
vježbe zdravstvene njege","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/33523"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/33523"}}},{"sifra":34164,"naziv":"Genetika šećerne bolesti","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34164"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34164"}}},{"sifra":34165,"naziv":"Genetička osnova razvoja","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34165"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34165"}}},{"sifra":34167,"naziv":"Prijelomi kostiju ramenog i zdjeličnog obruča i dugih kostiju","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34167"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34167"}}},{"sifra":34168,"naziv":"Temelji radiološke anatomije","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34168"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34168"}}},{"sifra":34169,"naziv":"Laparoskopska anatomija abdomena","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34169"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34169"}}},{"sifra":34171,"naziv":"Razvoj i prirođene bolesti bubrega","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34171"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34171"}}},{"sifra":34172,"naziv":"Fertilitet i spolno ponašanje","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34172"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34172"}}},{"sifra":34173,"naziv":"Oplodnja","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34173"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34173"}}},{"sifra":34174,"naziv":"Kako nastaju tumori?","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34174"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34174"}}},{"sifra":34175,"naziv":"Komunikacijske vještine","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34175"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34175"}}},{"sifra":34176,"naziv":"Informatika za medicinare","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34176"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34176"}}},{"sifra":34229,"naziv":"DNA","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/34229"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/34229"}}},{"sifra":36892,"naziv":"Planiranje obitelji","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/36892"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/36892"}}},{"sifra":36893,"naziv":"Freud ili pronađena psihoanaliza","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/36893"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/36893"}}},{"sifra":36896,"naziv":"Prehrana - izvor zdravlja i bolesti","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/36896"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/36896"}}},{"sifra":40396,"naziv":"Algoritam reanimacijskog postupka u djece","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/40396"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/40396"}}},{"sifra":65418,"naziv":"Tjelesna i zdravstvena kultura I","_links":{"nastavniprogram_predmet":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/sifra/65418"},"nastavniprogram_predmetuakademskojgodini":{"href":"https://www.isvu.hr/apiproba/vu/63/nastavniprogram/predmet/akademskagodina/2005/sifra/65418"}}}]}}
  */