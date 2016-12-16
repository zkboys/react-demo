exports.errorMessages = {
    loginNameCanNotBeNull: [1000, '用户名不能为空'],
    loginNameLengthInvalid: [1001, '登录名至少需要2个字符'],
    loginNameInvalid: [1002, '登录名不合法'],
    loginNameIsUsed: [1003, '登录名已被使用'],

    passCanNotBeNull: [2000, '密码不能为空'],
    passInvalid: [2001, '密码不可用'],
    oldPassCanNotBeNull: [2002, '原密码不能为空'],
    oldPassInvalid: [2003, '原密码错误'],
    newPassCanNotBeNull: [2004, '新密码不能为空'],
    newPassRepeatCanNotBeNull: [2005, '重复新密码不能为空'],
    towPassIsDifferent: [2006, '两次输入密码不一致'],

    loginNamePassCanNotBeNull: [3000, '用户名密码不能为空'],
    loginNamePassInvalid: [3001, '用户名或者密码错误'],
    userIsLocked: [3004, '您已经被管理员屏蔽，如有疑问，请与管理员联系'],
    userIsNotExisted: [3005, '用户不存在'],
}