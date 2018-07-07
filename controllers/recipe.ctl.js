const mongoose = require('mongoose');
var   recipe = require('../models/recipe-schema'),
category = require('../models/category-schema'),
User = require('../models/user-schema'),
unsort = require('array-unsort').unsort,
promise = require('promise'),
sleep = require('system-sleep'),
comment = require('./comment.ctl'),
Comment = require('../models/comment-schema');



module.exports = {
  getAllRecipes,
  getRecipeById,
  getRecipesPure,
  getRecipeByCategory,
  deleteRecipe
}


function deleteRecipe(recipe_id){
  var comment_array = [];
  return new promise((resolve, reject) => {
    recipe.findOne({"_id": recipe_id}, (err, rec) => {
      if(err)
      reject(err);
      else{
        comment_array = rec.comments;
        for(let i in comment_array){
          Comment.deleteOne({"_id":comment_array[i]}, err => {
            if(err)
            console.log(`err: ${err}`);
          });
        }

        recipe.deleteOne({"_id": recipe_id}, err =>  {
          if(err)
          console.log(`err: ${err}`);
          else {
            resolve(true);
          }
        });
      }
    });
  });
}


function getStatistics(user_id){
  return new promise((resolve, reject) => {
    User.findOne({"_id": user_id},(err, usr)=>{
      if(err)
      reject(err);
      else{
        var i = usr.profile_categories.meat +
        usr.profile_categories.milk +
        usr.profile_categories.vegetarian +
        usr.profile_categories.vegan +
        usr.profile_categories.chicken +
        usr.profile_categories.dessert;

        statistics = {
          "meat" : usr.profile_categories.meat/i,
          "milk" : usr.profile_categories.milk/i,
          "vegan" : usr.profile_categories.vegan/i,
          "vegetarian" : usr.profile_categories.vegetarian/i,
          "chicken" : usr.profile_categories.chicken/i,
          "dessert" : usr.profile_categories.dessert/i
        };
        resolve(statistics);
      }
    });
  });
}



function getAllCategories(){
  return new promise((resolve, reject) => {
    category.findOne({},(err, categories)=>{
      if(err)
      reject(err);
      else
      resolve(categories);
    });
  });
}

function getRecipeByCategory(category_name){
  return new promise((resolve, reject) => {
    category.findOne({"_id": '5b164679e7179a6034c7403b'}, (err, rec) => {
      if(err)
      reject(err);
      else{
        getRecipesPure(rec[category_name].recipes)
        .then((result,error)=>{
          if(error)
          rejcect(error);
          else
          resolve(result);
        });
      }
    });
  });
}


function getRecipeById(recipe_id){
  return new promise((resolve, reject) =>{
    recipe.findOne({"_id": recipe_id}, (err, rec) => {
      if(err)
      reject(err);
      else
        resolve(rec);
    });
  });
};



function getRecipeByStatistics(user_id){
  return new promise((resolve,reject)=>{
    var statistics, categories;
    getStatistics(user_id).then((result, error) => {
      if(result){
        statistics = result;
        getAllCategories().then((result, error) => {
          if(result){
            categories = result;
            var meatArray = categories.meat.recipes,
            milkArray = categories.milk.recipes,
            chickenArray = categories.chicken.recipes,
            veganArray = categories.vegan.recipes,
            vegetarianArray = categories.vegetarian.recipes,
            dessertArray = categories.dessert.recipes;

            var sortedArray = [];

            for (var i in statistics){
              sortedArray.push([statistics[i],i]);
            }
            sortedArray.sort();

            rand = parseInt(Math.random()*dessertArray.length);
            sortedArray[0][0] = 0.2;
            sortedArray[1][0] = 0.3;
            sortedArray[2][0] = 0.4;
            sortedArray[3][0] = 0.5;
            sortedArray[4][0] = 0.7;
            sortedArray[5][0] = 1;

            var recipeArray = [];
            var rand;
            for(let i in sortedArray){
              switch(sortedArray[i][1]){
                case "dessert":
                sortedArray[i][0] = sortedArray[i][0] * dessertArray.length;
                for(var j=0 ; j<sortedArray[i][0] ; j++){
                  recipeArray.push(dessertArray[rand]);
                  dessertArray.splice(rand,1);
                }
                break;
                case "milk":
                sortedArray[i][0] = sortedArray[i][0] * milkArray.length;
                for(var j=0 ; j<sortedArray[i][0] ; j++){
                  rand = parseInt(Math.random()*milkArray.length);
                  recipeArray.push(milkArray[rand]);
                  milkArray.splice(rand,1);
                }
                break;
                case "meat":
                sortedArray[i][0] = sortedArray[i][0] * meatArray.length;
                for(var j=0 ; j<sortedArray[i][0] ; j++){
                  rand = parseInt(Math.random()*meatArray.length);
                  recipeArray.push(meatArray[rand]);
                  meatArray.splice(rand,1);
                }
                break;
                case "vegan":
                sortedArray[i][0] = sortedArray[i][0] * veganArray.length;
                for(var j=0 ; j<sortedArray[i][0] ; j++){
                  rand = parseInt(Math.random()*veganArray.length);
                  recipeArray.push(veganArray[rand]);
                  veganArray.splice(rand,1);
                }
                break;
                case "vegetarian":
                sortedArray[i][0] = sortedArray[i][0] * vegetarianArray.length;
                for(var j=0 ; j<sortedArray[i][0] ; j++){
                  rand = parseInt(Math.random()*vegetarianArray.length);
                  recipeArray.push(vegetarianArray[rand]);
                  vegetarianArray.splice(rand,1);
                }
                break;
                case "chicken":
                sortedArray[i][0] = sortedArray[i][0] * chickenArray.length;
                for(var j=0 ; j<sortedArray[i][0] ; j++){
                  rand = parseInt(Math.random()*chickenArray.length);
                  recipeArray.push(chickenArray[rand]);
                  chickenArray.splice(rand,1);
                }
                break;
              }
            }
            var unsortedArray = unsort(recipeArray);
            resolve(unsortedArray);
          }
          else{
            console.log(error);
          }
        });
      }
      else{
        console.log(error);
      }
    });
  });
}


function getRecipesPure(fav_array){
  return new promise((resolve, reject) => {
    recipe.find({"_id": {$in: fav_array}}, (err, rec) => {
      if(err)
      reject(err);
      else{
        resolve(rec);
      }
    });
  });
}


function lastFilter(user_id, recipe_array){
  return new promise((resolve, reject) => {
    var slow_array = [],
    fast_array = [],
    sorted_array = [];
    const time = 30;
    User.findOne({"_id": user_id}, (err, rec) => {
      if(err)
      reject(`err: ${err}`)
      else{
        if(rec.fast == true && rec.diet == true){
          for(let i in recipe_array){
            if(recipe_array[i].preparation_time <= time)
            fast_array.push(recipe_array[i]);
            else
            slow_array.push(recipe_array[i]);
          }
          fast_array.sort((a, b) => {
            return a.calories - b.calories ;
          });
          slow_array.sort((a, b) => {
            return a.calories - b.calories ;
          });
          sorted_array = fast_array.concat(slow_array);

        }

        else if(rec.fast == true && rec.diet == false){
          sorted_array = recipe_array.sort((a, b) => {
            return a.preparation_time - b.preparation_time;
          });
        }

        else if(rec.fast == false && rec.diet == true){
          sorted_array = recipe_array.sort((a, b) => {
            return a.calories - b.calories ;
          });
        }
        else {
          sorted_array = recipe_array;
        }

        if(rec.block_list.gluten == 1){
          sorted_array = sorted_array.filter(function (e) {
            return e.gluten != 1;
          });
        }
        if(rec.block_list.lactose == 1){
          sorted_array = sorted_array.filter(function (e) {
            return e.lactose != 1;
          });

        }
        if(rec.block_list.peanuts == 1){
          sorted_array = sorted_array.filter(function (e) {
            return e.peanuts != 1;
          });
        }
        resolve(sorted_array);
      }
    });
  });
}


function getAllRecipes(user_id){
  return new promise((resolve, reject) => {
    getRecipeByStatistics(user_id).then((result, error) => {
      if(error){
        console.log("error");
        reject(error);
      }
      else{
        recipe.find({"_id": {$in: result}}, (err, rec) => {
          if(err)
          reject(err);
          else{
            lastFilter(user_id, rec).then((result1, error) => {
              if(result1)
              resolve(result1);
            });
            // resolve(recipe_array);
          }
        });
      }
    });
  });
}
