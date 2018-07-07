const mongoose = require('mongoose');
var comment = require('../models/comment-schema'),
    recipe = require('../models/recipe-schema'),
    promise = require('promise');


module.exports = {
    createComment,
    deleteComment,
    getCommentsContent
}


function createComment(user_name1, rate1, content1, recipe_id){
      return new promise((resolve, reject) => {
        if((rate1 == null && content1 == null) || (rate1 == "" && content1 == "") || (rate1 == " " && content1 == " ")){
          resolve("invalid input");
        }
        var Comment1 = new comment ({
            user_name: user_name1,
            rate: rate1,
            content: content1
        });
        Comment1.save(
            (err, single_comment) =>
            {
                if(err)
                console.log(`err: ${err}`);
                else{
                    recipe.update({"_id": recipe_id}, {$push: {"comments": single_comment._id}},
                    (err) => {
                        if(err)
                        console.log(`err: ${err}`);
                        else{
                            resolve(true);
                        }
                    });
                    console.log(`Comment added to collection: ${JSON.stringify(Comment1)}`);
                }
            });
      });

    }

    function checkuserid(user_name,comment_id){
        return new promise((resolve, reject) => {
            comment.findOne({"_id": comment_id}, (err, rec) => {
                if(err){
                    console.log(`error : ${err}`)
                }
                else{
                    if(rec.user_name == user_name)
                    {
                        resolve(true);

                    }
                    else{
                        resolve(false);
                    }
                }
            });
        });
    }


    function deleteComment(recipe_id, comment_id, user_name){
      return new promise((resolve, reject) => {
        checkuserid(user_name,comment_id).then((result,error)=>{
            if(result){
                recipe.update({"_id": recipe_id}, {$pull: {"comments": comment_id}},
                (err) => {
                    if(err)
                    console.log(`err: ${err}`);
                    else{
                        comment.deleteOne({"_id": comment_id}, err => {
                            if(err)
                            console.log(`error: ${err}`);
                            else
                            resolve(true);
                        });
                    }
                });
            }
            else{
                console.log("the user tried to delete invalid comment");
            }
        });
      });

    }



function getCommentsContent(comment_array){
    return new promise((resolve, reject) => {
            comment.find({"_id": {$in: comment_array}}, (err, rec) => {
                if(err)
                reject(err);
                else
                resolve(rec);
            });
    });
}
