class Transaction {
    constructor(type, amount, balanceAfter) {
        this.id = Math.random().toString(36).substr(2, 9).toUpperCase();
        this.timestamp = new Date().toLocaleString();
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
    }
}

class BankAccount {
    constructor(name, type) {
        this.name = name;
        this.type = type;
        this.balance = 0;
        this.history = [];
    }
}

class User {
    constructor(username, password, fullName) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.accounts = [];
    }
}

class Bank {
    constructor() {
        this.users = [];
        this.manager = { username: "admin", password: "manager123" };
        this.session = null;
        this.role = null;
    }

    login(username, password) {
        if (username === this.manager.username && password === this.manager.password) {
            this.session = this.manager;
            this.role = "MANAGER";
            console.log("--- Manager Access Granted ---");
            return;
        }

        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
            this.session = user;
            this.role = "USER";
            console.log(`--- Welcome back, ${user.fullName} ---`);
        } else {
            console.log("Error: Invalid credentials.");
        }
    }

    logout() {
        this.session = null;
        this.role = null;
        console.log("Logged out.");
    }

    managerCreateUser(username, password, fullName) {
        if (this.role !== "MANAGER") return console.log("Access Denied.");
        if (this.users.find(u => u.username === username)) return console.log("User exists.");
        
        const newUser = new User(username, password, fullName);
        this.users.push(newUser);
        console.log(`User ${username} created.`);
    }

    managerViewAllUsers() {
        if (this.role !== "MANAGER") return console.log("Access Denied.");
        const data = this.users.map(u => ({
            Username: u.username,
            Name: u.fullName,
            AccountsCount: u.accounts.length
        }));
        console.table(data);
    }

    managerViewUserHistory(username) {
        if (this.role !== "MANAGER") return console.log("Access Denied.");
        const user = this.users.find(u => u.username === username);
        if (!user) return console.log("User not found.");
        
        user.accounts.forEach(acc => {
            console.log(`History for ${user.fullName} - ${acc.name}:`);
            console.table(acc.history);
        });
    }

    userOpenAccount(name, type) {
        if (this.role !== "USER") return console.log("Login as user first.");
        const acc = new BankAccount(name, type);
        this.session.accounts.push(acc);
        console.log(`Account ${name} opened.`);
    }

    userTransact(accIndex, type, amount) {
        if (this.role !== "USER") return console.log("Login as user first.");
        const acc = this.session.accounts[accIndex];
        if (!acc) return console.log("Account not found.");

        if (type.toUpperCase() === "WITHDRAW" && amount > acc.balance) {
            return console.log("Insufficient funds.");
        }

        acc.balance = type.toUpperCase() === "DEPOSIT" ? acc.balance + amount : acc.balance - amount;
        acc.history.push(new Transaction(type.toUpperCase(), amount, acc.balance));
        console.log(`Transacted $${amount}. New Balance: $${acc.balance}`);
    }

    userViewStatus() {
        if (this.role !== "USER") return console.log("Login as user first.");
        console.log(`Account Details for ${this.session.fullName}:`);
        console.table(this.session.accounts);
    }
}

const myBank = new Bank();

myBank.login("admin", "manager123");
myBank.managerCreateUser("vatsal_ai", "ai2029", "Vatsal Engineering");
myBank.managerCreateUser("guest_user", "guest1", "Guest Account");
myBank.managerViewAllUsers();
myBank.logout();

myBank.login("vatsal_ai", "ai2029");
myBank.userOpenAccount("Primary Checking", "Checking");
myBank.userTransact(0, "DEPOSIT", 2500);
myBank.userTransact(0, "WITHDRAW", 500);
myBank.userViewStatus();
myBank.logout();

myBank.login("admin", "manager123");
myBank.managerViewUserHistory("vatsal_ai");