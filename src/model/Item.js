module.exports = class Item {
    constructor(id, fname, lname, empStatus, empRole, employer) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.employment = [
            new Employment(empStatus, empRole, employer)
        ];
    }

    getFirstname() {
        return this.fname;
    }

    getId() {
        return this.id;
    }

    serveItem() {
        return this;
    }
};

class Employment {
    constructor(empStatus, empRole, employer) {
        this.empStatus = empStatus;
        this.empRole = empRole;
        this.employer = employer;
    }
};
// {
//             "id": id,
//             "fName": fname,
//             "lName": lname,
//             "employment": [{
//                 "status": empStatus,
//                 "role": empRole,
//                 "employer": employer
//             }]
//         }