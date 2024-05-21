import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */
 
class LibraryApi {
    // the token for interactive with the API will be stored here.
    static token;

    // QUESTION - Is there a reason data comes first? 
        // Post method with only url params would need empty data
        // nitpicky?
    static async request(endpoint, data = {}, method = "get") {
        console.debug("API Call:", endpoint, data, method);
        try{
          this.token = JSON.parse(localStorage.getItem('token'))
        } catch(e) {
          console.log(e)
        }
        
        // add token to header
        const url = `${BASE_URL}/${endpoint}`;
        const headers = { Authorization: `Bearer ${this.token}` };
        const params = (method === "get")
            ? data
            : {};
    
        try {
          return (await axios({ url, method, data, params, headers })).data;
        } catch (err) {
          console.error("API Error:", err.response);
          let message = err.response.data.error.message;
          throw Array.isArray(message) ? message : [message];
        }
      }
    // ----- Auth -----
    // Register new user
    static async register(data){
        let res = await this.request('auth/register', data, "post");
        return res.token
    }
    // Login
    static async login(data){
        let res = await this.request('auth/token', data, "post");
        return res.token
    }

    // ----- Books -----
    // ** Get all books*/
    static async getAllBooks(){
        let res = await this.request('books');
        return res.books
    }

    /** Get all outstanding books */
    static async getOutstandingBooks(){
        let res = await this.request('books/outstanding');
        return res.books
    }
    
    /** Check out a book to a student */
    static async checkOut(data){
        let res = await this.request('books/checkout', data, "post");
        return res.borrowed
    }

    /** Check in an outstanding book */
    static async checkIn(data){
        let res = await this.request('books/checkin', data, "post");
        return res.returned
    }

    /** Get book by id */
    static async getBook(id){
        let res = await this.request(`books/${id}`);
        return res.book
    }

    // ----- Classes -----
    /** Get a class */
    static async getClass(id){}

    // ----- Schools -----
    /** Get a school */
    static async getSchool(id){}

    // ----- Sets -----
    /** Get a set of books */
    static async getSet(id){}

    /** Update a set of books */
    static async updateSet(data){}

    /** Delete a set of books */
    static async deleteSet(){}

    // ----- Students -----
    /** Get all students */
    static async getAllStudents(){
        let res = await this.request('students');
        return res.students;
    }

    /** Get all students in a given class */
    static async getStudentsByClass(class_id){
        let res = await this.request(`classes/${class_id}/students`);

    }

    /** GEt all students in a given school */
    static async getStudentsBySchool(school_id){
        let res = await this.request(`schools/${school_id}/students`)
        return res.students;
    }

    /** Get student by ID */
    static async getStudent(id){
        let res = await this.request(`students/${id}`);
        return res.student
    }

    /** Get unread books for given student */
    static async getUnread(id){
        let res = await this.request(`students/${id}/unread`);
        return res.unread
    }

    // ----- Users -----
    /** create new user - admin only*/
    static async createUser(data){
        let res = await this.request('users/create', data, "post");
        return res
    }

    /** get all users */
    static async getAllUsers(){
        let res = await this.request('users');
        return res.users
    }

    /** Get user by ID */
    static async getUser(id){
        let res = await this.request(`users/${id}`);
        return res.user
    }

    /** Update user */
    static async updateUser(data){
        let res = await this.request(`users/${data.id}`, data, "patch");
        return res.updated
    }

    /** Delete user by ID */
    static async deleteUser(id){
        let res = await this.request(`users/${id}`, {}, "delete");
        return res.user
    }

    /** test connection */
    static async testConnection(){
        let res = await this.request('test');
        return res
    }


}

// for testing - (id - 10001, password: password)
// LibraryApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNTk4MTU5MjU5fQ.b9jGEl-PGBoquqakuQVym89Vw0B5FInCk0MJD0FIb_k";

export default LibraryApi;