var   express   = require('express'),
app       = express(),
userCtl = require('./controllers/user.ctl'),
commentCtl = require('./controllers/comment.ctl'),
recipeCtl = require('./controllers/recipe.ctl'),
bodyParser = require('body-parser'),
port      = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('port',port);
app.use('/', express.static('./public'));//for API
app.use(
 (req,res,next) => {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
 next();
 });


app.post('/createUser', (req, res) => {
  userCtl.createUser(req.body.userName, req.body.password, req.body.email).
  then((result, error) => {
    if(result.id)
    res.status(200).send(result);
    else if(result == "invalid input")
    res.status(200).json({"error" :"invalid input"});
    else
    res.status(200).json({"message" : true});
  });
});


app.post('/deleteRecipe', (req, res) => {
  recipeCtl.deleteRecipe(req.body.recipeID).then((result, error) => {
    if(result)
      res.status(200).json({"message": "recipe deleted successfully"});
  });
});

app.post('/setUserBlockList', (req, res) =>{
  userCtl.setUserBlockList(req.body.userID, req.body.gluten, req.body.lactose, req.body.peanuts, req.body.diet, req.body.fast).then((result, error) => {
    if(result)
      res.status(200).json({"message": "blocklist updated"});
  });
});

app.post('/addFavorites', (req, res) => {
  userCtl.addFavorites(req.body.userID, req.body.recipeID)
  .then((result, error) =>{
    if(result){
      res.status(200).json({"message": "recipe added to favorites"});
    }
  });
});

app.post('/deleteFavorites', (req, res) => {
  userCtl.deleteFavorites(req.body.userID, req.body.recipeID)
  .then((result, error) =>{
    if(result){
      res.status(200).json({"message": "recipe deleted from favorites"});
    }
  });
});

app.post('/setStatistics', (req, res) => {
  userCtl.setStatistics(req.body.userID, req.body.category).then((result, reject) => {
    if(result == true)
    res.status(200).json({'message': "category updated"});
  });
});

app.post('/getFavorites', (req, res) => {
  userCtl.getFavorites(req.body.userID).then((result, reject) => {
    if(result)
    res.status(200).send(result);
    else {
    res.status(200).send({'message': 'no favorite for this user'});
    }
  });
});

app.post('/getUserRecipesByStatistics', (req, res) => {
  recipeCtl.getAllRecipes(req.body.userID).then((result, error) => {
    if(result)
    res.status(200).send(result);
  });
});

app.post('/getRecipeById', (req, res) => {
recipeCtl.getRecipeById(req.body.recipeID).then((result, error) => {
  if(result)
    res.status(200).send(result);
});
});

app.post("/getRecipesByCategory", (req, res) => {
  recipeCtl.getRecipeByCategory(req.body.category).then((result, error) => {
    if(result)
      res.status(200).send(result);
  });
});

app.post("/createComment", (req, res) => {
  commentCtl.createComment(req.body.userName, req.body.rate, req.body.content, req.body.recipeID).then((result, error) => {
    if(result == "invalid input")
      res.status(200).json({"error": result});
    else
      res.status(200).json({"message": "comment added"});
  });
});

  app.post("/getcommentcontent", (req, res) => {
  commentCtl.getCommentsContent(req.body.commentsid).then((result, error) => {
    if(result == "invalid input")
      res.status(200).json({"error": result});
    else
      res.status(200).send(result);
  });
});



app.post("/deleteComment", (req, res) => {
  commentCtl.deleteComment(req.body.recipeID, req.body.commentID, req.body.userName).then((result, error) => {
    if(result)
      res.status(200).json({"message": "comment deleted"});
  });
});

app.get('/css/style.css', (req, res) => {
  res.sendFile(`${__dirname}/css/style.css`);
});


app.all('*', (req, res) => {
  res.status(200).sendFile(`${__dirname}/index.html`);
});


app.listen(port);
console.log(`listening on port ${port}`);
