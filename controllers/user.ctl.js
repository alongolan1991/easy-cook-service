const mongoose = require('mongoose');
var User = require('../models/user-schema'),
    promise = require('promise'),
    recipe = require('./recipe.ctl');

module.exports = {
  createUser,
  addFavorites,
  deleteFavorites,
  setStatistics,
  getFavorites,
  setUserBlockList
}


function setUserBlockList(user_id, gluten, lactose, peanuts, diet, fast){
  return new promise((resolve, reject) =>{
  if(gluten == true){
    console.log("gluten");
    User.update({"_id": user_id}, {"block_list.gluten" : gluten},
    (err) => {
      if(err)
      console.log(`err: ${err}`);
    });
  }
  if(lactose == true){
    console.log("lactose");
    User.update({"_id": user_id}, {"block_list.lactose" : lactose},
    (err) => {
      if(err)
      console.log(`err: ${err}`);
    });
  }
  if(peanuts == true){
    console.log("peanuts");
    User.update({"_id": user_id}, {"block_list.peanuts" : peanuts},
    (err) => {
      if(err)
      console.log(`err: ${err}`);
    });
  }
  if(diet == true){
    console.log("diet");
    User.update({"_id": user_id}, {"diet" : diet},
    (err) => {
      if(err)
      console.log(`err: ${err}`);
    });
  }
  if(fast == true){
    console.log("fast");
    User.update({"_id": user_id}, {"fast" : fast},
    (err) => {
      if(err)
      console.log(`err: ${err}`);
    });
  }
  User.update({"_id": user_id}, {"password" : "1"},
  (err) => {
    if(err)
    console.log(`err: ${err}`);
  });
  resolve(true);
});
}

function setStatistics(user_id, category){
  return new promise((resolve, reject) =>{
    switch (category) {
      case "meat":
      User.update({"_id": user_id}, {$inc: {"profile_categories.meat" : 1}},
      (err) => {
        if(err)
        reject(`err: ${err}`);
        else{
          resolve(true);
        }
      }
    );
    break;

    case "milk":
    User.update({"_id": user_id}, {$inc: {"profile_categories.milk" : 1}},
    (err) => {
      if(err)
      reject(`err: ${err}`);
      else{
        resolve(true);
      }
    }
  );
  break;

  case "dessert":
  User.update({"_id": user_id}, {$inc: {"profile_categories.dessert" : 1}},
  (err) => {
    if(err)
    reject(`err: ${err}`);
    else{
      resolve(true);
    }
  }
);
break;

case "vegan":
User.update({"_id": user_id}, {$inc: {"profile_categories.vegan" : 1}},
(err) => {
  if(err)
  reject(`err: ${err}`);
  else{
    resolve(true);
  }
}
);
break;

case "vegetarian":
User.update({"_id": user_id}, {$inc: {"profile_categories.vegetarian" : 1}},
(err) => {
  if(err)
  reject(`err: ${err}`);
  else{
    resolve(true);
  }
}
);
break;

case "chicken":
User.update({"_id": user_id}, {$inc: {"profile_categories.chicken" : 1}},
(err) => {
  if(err)
  reject(`err: ${err}`);
  else{
    resolve(true);
  }
}
);
break;
}

});
}


function addFavorites(user_id, recipe_id){
  return new promise((resolve, reject) => {
    User.update({"_id": user_id}, {$push: {"favorites": recipe_id}},
    (err) => {
      if(err)
      reject(`err:${err}`);
      else{
        resolve(`Updated document: ${User}`);
      }
    }
  );
});

}


function deleteFavorites(user_id, recipe_id){
  return new promise((resolve, reject) => {
    User.update({"_id": user_id}, {$pull: {"favorites": recipe_id}},
    (err) => {
      if(err)
      reject(`err:${err}`);
      else{
        resolve(`Updated document: ${User}`);
      }
    }
  );
});

}


function getFavorites(user_id){
  return new promise((resolve, reject) => {
    User.findOne({"_id": user_id}, (err, rec) => {
      if(err){
        reject(err);
      }
      else{
        if(rec.favorites == null || rec.favorites.length == 0 ){
          resolve(false);
        }
        recipe.getRecipesPure(rec.favorites)
        .then((result, error) => {
          if(error)
          console.log(`error: ${error}`);
          else{
            resolve(result);
          }
        });
      }
    });
  });
}


function createUser(fullName, password, email){
  return new promise((resolve, reject) => {
    if(fullName == null ||  fullName == "" || fullName == " " || password == null || password == "" || password == " " )
    resolve("invalid input");

    User.findOne({'full_name': fullName},(err,rec)=>{
      if(err){
        console.log(`error:${err}`);
      }
      else if(rec == null){
        var user = new User ({
          full_name: fullName,
          password: "0",
          email: email,
          favorites: [],
          diet: 0,
          fast: 0,
          profile_categories:{
            meat: 0,
            milk: 0,
            vegetarian: 0,
            dessert: 0,
            vegan: 0,
            chicken: 0
          },
          block_list:{
            gluten:0,
            lactose:0,
            peanuts:0
          }

        });
        user.save(
          (err) =>
          {
            if(err)
            console.log(`err: ${err}`);
            else{
              resolve(user);
            }
          });
        }
        else {
          resolve(rec);
        }
      });
    });
  }
