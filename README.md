# Sonet

Социальная сеть на django rest framework + react.

## Предпросмотр (клик по картинке)

---


[![Sonet Video](https://img.youtube.com/vi/T_DJ4dWNjbQ/0.jpg)](https://www.youtube.com/watch?v=T_DJ4dWNjbQ)

## Основной стек технологий

---

#### Backend

- Python
- Django
- Django Rest Framework
- Django-channels
- Djoser

#### Базы данных

- PostgreSQL

#### Frontend

- JavaScript
- React
- Redux
- React-Toastify
- Axios
- react-infinite-scroll

#### Devops

- Docker (docker-compose)

## Функционал

---

#### Пользователи

- Авторизация
- Аутентификация
- Регистрация
- CRUD

#### Система друзей

- Система подписок
- Заявки в друзья
- Дружеские отношения между пользователями

#### Посты

- Посты пользователей
- Посты групп
- Лента новостей
- Лайки
- CRUD

#### Поиск

- По пользователям
- По группам

#### Группы

- CRUD
- Система подписок

#### Чат

- Приватные чаты
- Сохранение и получение истории сообщений
- Обмен сообщениями в режиме реального времени
- Список чатов в реальном времени
- Система прочитанных/непрочитанных сообщений
- Чтение сообщений в реальном времени

#### Система нотификаций

- Чтение, удаление нотификаций
- Различные типы нотификаций (Лайк, сообщение, создание заявки в друзья, добавление в друзья)
- Нотификации в режиме реального времени

## Установка (для разработки)

1. Устанавливаем [Docker](https://www.docker.com/products/docker-desktop/).
2. Клонируем репозиторий.
3. В терминале выбираем папку с репозиторием.
4. Делаем `docker-compose build` (придется ждать пару минут).
5. Запускаем `docker-compose up` (минута-две)
6. При первом запуске нужно сделать миграции в django (Открываем другую командную строку и заходим в консоль активного
   контейнера `docker exec -it sonet-backend-1 sh`, дальше в данной консоли пишем `python manage.py migrate`)
7. Переходим на http://localhost:3000/.

****Примечание: в данном проекте используется публичные ключи.(django secret key)****
