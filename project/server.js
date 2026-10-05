const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// CSS, изображения
app.use(express.static(path.join(__dirname, "public")));

// Чтение данных
function readItems() {
    const data = fs.readFileSync(
        path.join(__dirname, "data.json"),
        "utf-8"
    );

    return JSON.parse(data);
}

// Главная страница
app.get("/", function (req, res) {
    const places = readItems();

    res.render("index", {
        title: "Тур-гид по Астане",
        heading: "Популярные места Астаны",
        places: places
    });
});

// Страница одного места
app.get("/place/:id", function (req, res) {
    const id = Number(req.params.id);

    const place = readItems().find(function (item) {
        return item.id === id;
    });

    if (!place) {
        return res.status(404).render("404", {
            title: "Место не найдено",
            message: "Такого места в нашем гиде нет."
        });
    }

    res.render("place", {
        title: place.title,
        place: place
    });
});

// Информационная страница
app.get("/about", function (req, res) {
    res.render("about", {
        title: "О проекте",
        heading: "О нашем тур-гиде"
    });
});

// 404
app.use(function (req, res) {
    res.status(404).render("404", {
        title: "Страница не найдена",
        message: "К сожалению, такой страницы не существует."
    });
});

// Запуск сервера
app.listen(PORT, function () {
    console.log(`Сайт запущен: http://localhost:${PORT}`);
});