# VK Bot for community schedule (vk wiki markup)

Этот бот создан для редактирования расписания сообщества с помощью VK pages API, т.е. wiki-markup страниц.

Использовалась библиотека VK-IO для Node.js и зависимые модули VK-IO Session, VK-IO Scenes.

# Для запуска скрипта

```
npm i
node bot.js
```

# В .env прописать свои значения

```
LONG_POLL_TOKEN = your_token

USER_TOKEN = your_token

PAGE_ID = your_id

GROUP_ID = your_id

USER_ID = your_id

PAGE_URL = your_id
```
