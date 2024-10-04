const { Router } = require("express");
const router = Router();

const {
    createPost,
    getAllPosts,
    updatePostById,
    deletePostById,
} = require("../controllers/postsController.js");

const { addAdmin } = require("../controllers/signUpController.js");

const {
    getUsers,
    deleteUser,
    getSingleUser,
    updateUser,
    createProfile,
    getProfileById,
    updateProfileById,
    getAllUsers,
    updateAcceptedStatus,
} = require("../controllers/usersController.js");

const { addGovernor } = require("../controllers/addgovernorController.js");

const {
    createTag,
    getAllTags,
    getAllTagsFilter,
    getTagById,
    updateTagById,
    deleteTagById,
} = require('../controllers/tagsController');

/*
    1-post toursimGoverner
    2-delete user
    3-post admin
    4-CRUD on activityCategory
    5-CRUD on tags
    6-post product
    7-edit product 
    8-get all products
    9-get all products by name
    10-get all products by price
    11-get all products sorted by rating
*/

router.get("/getUsers", getUsers);   
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);   
router.put("/updateUserStatus/:id", updateAcceptedStatus);       
router.post("/addAdmin", addAdmin);  
router.post("/createProduct", createPost);


// Route for getting all posts (products)
router.get("/products", getAllPosts);

// Route for updating a post (product) by ID
router.put("/products/:id", updatePostById);
router.delete("/products/:id", deletePostById);


router.post('/tag', createTag);

router.get('/tag', getAllTags);

router.get('/tag/filter/:name', getAllTagsFilter);

router.get('/tag/:id', getTagById);

router.put('/tag/:id', updateTagById);

router.delete('/tag/:id', deleteTagById);



router.post("/add-governor", addGovernor);

router.get("/getUsers", getUsers);
router.delete("/deleteUser/:id", deleteUser);
router.put("/updateUser/:id", updateUser);
router.put("/updateUserStatus/:id", updateAcceptedStatus);
router.post("/addAdmin", addAdmin);
router.post("/createProduct", createPost);

// Route for getting all posts (products)
router.get("/products", getAllPosts);

// Route for updating a post (product) by ID
router.put("/products/:id", updatePostById);
router.delete("/products/:id", deletePostById);

module.exports = router;
