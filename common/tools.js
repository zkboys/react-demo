var bcrypt = require('bcryptjs');
var moment = require('moment');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);

    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};

exports.bhash = function (str) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(str, 10, (error, passhash) => {
            if (error) {
                reject(error);
            } else {
                resolve(passhash);
            }
        });
    });
};


exports.bcompare = function (str, hash) {

    return new Promise((resolve, reject) => {
        bcrypt.compare(str, hash, (error, bool) => {
            if (error) {
                reject(error);
            } else {
                resolve(bool);
            }
        });
    });
};

