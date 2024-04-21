"use strict"
const { NotFoundError } = require('../expressError.js')

const db = require('../db')
// TODO - fix dateTime formatting

class BookSet {
    // Create new set
    static async createSet(school_id, stage){
        // if no stage, create whole set
        // check if last school set contains stage
        // create stage in last set if not, create new set if has 
    }

    // Delete set
    static async deleteSet(set_id){
        // find set
        // if none, return error
        // else delete set, return set_id
    }

}

module.exports = BookSet;