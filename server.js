const express = require("express")

const bodyParser = require('body-parser');
const cors = require("cors")
const dbConnection = require("./dbconnection")
const app = express();
//const sequelize = require('./dbconnection');
const ProductModel = require("./models/ProductModel")
const PORT = process.env.PORT || 8000

// const baseRoutes = require("./routes/base.route")
const userRoutes = require("./routes/user.route")
const clientRoutes = require("./routes/client.route")
const projectRoutes = require("./routes/project.route")
const taskdescriptionRoutes = require("./routes/taskdescription.route")
const taskRoutes = require("./routes/task.route")
const moduleRoutes = require("./routes/module.route")
const productRoutes = require("./routes/product.route")
const managerUserRoutes = require("./routes/managerusermapping.route")
const modulehubRoutes = require("./routes/modulehub.route")
const salarySlipbRoutes = require("./routes/salaryslip.route")


// Middleware to parse XML
app.use(express.json({limit: '350mb'}))
app.use(bodyParser.json());
app.use(cors())


// Increase timeout for all requests
app.use((req, res, next) => {
    req.setTimeout(120000); // 120 seconds (2 minutes)
    res.setTimeout(120000);
    next();
});


app.get("/api", (req, res) => {
    return res.status(201).json({
        success: true,
        message: "API is working"
    })
})

app.use("/api/user", userRoutes)
app.use("/api/client", clientRoutes)
app.use("/api/project", projectRoutes)
app.use("/api/taskdescription", taskdescriptionRoutes)
app.use("/api/task", taskRoutes)
app.use("/api/module", moduleRoutes)
app.use("/api/product", productRoutes)
app.use("/api/managerusermapping", managerUserRoutes)
app.use("api/modulehub", modulehubRoutes)
app.use("/api/salaryslip",salarySlipbRoutes)

//const server = https.createServer({}, app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// (async () => {
//     await ProductModel.sync({ force: true }); // ✅ This will delete and recreate the table
//     console.log("✅ PRODUCTS table recreated successfully.");
// })();