import requests

TELEGRAM_TOKEN = "тут_твій_токен"
CHAT_ID = "тут_твій_chat_id"
OPENWEATHER_KEY = "тут_твій_openweather_api_key"
CURRENCY_API = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json"
TRANSLATE_API = "https://api.mymemory.translated.net/get"

def send_message(message_text: str):
    url = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage"
    requests.post(url, json={"chat_id": CHAT_ID, "text": message_text})


def get_weather(city_name: str) -> str:
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city_name}&appid={OPENWEATHER_KEY}&units=metric&lang=ua"
    resp = requests.get(url).json()
    if resp.get("cod") != 200:
        return f"Місто '{city_name}' не знайдено."
    temp = resp["main"]["temp"]
    humidity = resp["main"]["humidity"]
    desc = resp["weather"][0]["description"]
    return f"Погода у {city_name}:\n🌡 {temp}°C\nВологість: {humidity}%\n☁ {desc}"


def get_currency(currency_code: str) -> str:
    resp = requests.get(CURRENCY_API).json()
    for item in resp:
        if item["cc"].upper() == currency_code.upper():
            return f"Курс {currency_code.upper()} до UAH: {item['rate']} грн"
    return f"Валюта '{currency_code}' не знайдена."


def translate_to_en(message_to_translate: str) -> str:
    params = {"q": message_to_translate, "langpair": "uk|en"}
    resp = requests.get(TRANSLATE_API, params=params).json()
    try:
        translated = resp["responseData"]["translatedText"]
        return f"Переклад: {translated}"
    except (KeyError, TypeError):
        return "Помилка перекладу."

def show_help() -> str:
    return (
        "Доступні команди:\n"
        "/weather {місто} - отримати погоду\n"
        "/currency {валюта} - курс валюти до UAH\n"
        "/translate_en {текст} - переклад на англійську\n"
        "/joke - випадковий жарт\n"
        "/help - показати цей список\n"
        "/exit - вихід з програми"
    )


if __name__ == "__main__":
    print("Введіть команду (/weather, /currency, /translate_en) або /exit для виходу.")
    while True:
        user_input = input("> ").strip()

        if user_input.startswith("/weather "):
            city_name_input = user_input.split("",1)[1]
            msg = get_weather(city_name_input)

        elif user_input.startswith("/currency"):
            currency_input = user_input.split("",1)[1]
            msg = get_weather(currency_input)

        elif user_input.startswith("/translate_en"):
            translate_input = user_input.split("",1)[1]
            msg = get_weather(translate_input)

        elif user_input in {"/exit, /quit"}:
            break

        else:
            msg = "Невідома команда"

        print(msg)
        send_message(msg)