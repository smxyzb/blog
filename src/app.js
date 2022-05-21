"use strict";
const db = {
    filterUser: (filter) => {
        console.log(filter());
        const arr = [{ admin: false, }, { admin: true }];
        return arr;
    }
};
const admins = db.filterUser(function () {
    console.log(this);
    return this.admin;
});
console.log(admins);
