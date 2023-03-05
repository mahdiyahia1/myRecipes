const express = require('express')
const path = require('path')
const app = express()
const axios = require('axios')
const INGREDIENTS = 'https://recipes-goodness-elevation.herokuapp.com/recipes/ingredient'

const dairyIngredients = ["Cream","Cheese","Milk","Butter","Creme","Ricotta","Mozzarella","Custard","Cream Cheese"]
const glutenIngredients = ["Flour","Bread","spaghetti","Biscuits","Beer"]
let allRecipes = []
let filteredRecipes = []

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))

const filterIngredients = function(ingredients, sensitivity) {
    let flag = 0
    ingredients.forEach((i) => {
        sensitivity.forEach((s) => {
            if(i == s) {
                flag = 1
            }
        })
    })
    if (flag == 0) {
        return true
    }
    else {
        return false
    }
}

app.get('/recipe/:ingredient', function(req, res) {
    let ingredient = req.params.ingredient
    let glutenCheck = req.query.gluten
    let dairyCheck = req.query.dairy
    let deleteCnt =req.guery.start
    allRecipes = []
    filteredRecipes = []
    axios.get(`${INGREDIENTS}/${ingredient}`)
    .then((recipes) => {     
            recipes.data.results.map((e) => {
                let recipe = {
                    id: e.idMeal,
                    title: e.title,
                    image: e.thumbnail,
                    link: e.href,
                    ingredients: e.ingredients
                }
                allRecipes.push(recipe)
            })
                if (glutenCheck == 1 && dairyCheck == 0) {
                    allRecipes.forEach((element) => {
                        if (filterIngredients(element.ingredients, glutenIngredients)) {
                            filteredRecipes.push(element)
                        }
                    })
                    res.send(filteredRecipes)
                    return
                }
                if (dairyCheck == 1 && glutenCheck == 0) {
                    allRecipes.forEach((element) => {
                        if (filterIngredients(element.ingredients, dairyIngredients)) {
                            filteredRecipes.push(element)
                        }
                    })
                    res.send(filteredRecipes)
                    return
                }
                if (dairyCheck == 1 && glutenCheck == 1) {
                    allRecipes.forEach((element) => {
                        if (filterIngredients(element.ingredients, dairyIngredients) && 
                        filterIngredients(element.ingredients, glutenIngredients)) {
                            filteredRecipes.push(element)
                        }
                    })
                    res.send(filteredRecipes)
                    return
                }
                else {
                    res.send(allRecipes)
                    return
                }
    })
    .catch((error) => {
        console.log(error)
    })
})

const port = 3000
app.listen(port, function () {
    console.log(`Server running on port ${port}`)
})