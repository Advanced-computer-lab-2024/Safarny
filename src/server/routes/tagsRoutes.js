const express = require('express');

const router = express.Router();
const {
    createTag,
    getAllTags,
    getAllTagsFilter,
    getTagById,
    updateTagById,
    deleteTagById,
} = require('../controllers/tagsController');

router.post('/', createTag);

router.get('/', getAllTags);

router.get('/filter/:name', getAllTagsFilter);

router.get('/:id', getTagById);

router.put('/:id', updateTagById);

router.delete('/:id', deleteTagById);

module.exports = router;