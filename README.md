# RegistrationApp

### RegistrationApp е клиент-сървър приложение. Клиентската част е single page application. Използва DOM манипулации за да променя съдържанието си. Има валидация на всички данни. Сървърното приложение използва NodeJS. То има http сървър, който обработва заявките и data layer за работа с MS SQL база от данни. Притежава JWT автентикация.

#### Приложението разполага с:
- валидация на данните (мейл, имена и парола)
- записване на данните в база данни.
- изпращане на мейл за верификация
- login/logout
- CRUD интерфейс/екран за данните на потребителя
- resend на мейл, ако не е получен мейла за верификация
