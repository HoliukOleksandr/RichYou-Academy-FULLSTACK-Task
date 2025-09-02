import json
import random
import string
import time
import functools
import sys

def logging_before(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"CALLING {func.__name__}: ARGS={args}, KWARGS={kwargs}")
        return func(*args, **kwargs)
    return wrapper


def logging_after(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        print(f"PROCESSED {func.__name__}: RESULT={result}")
        return result
    return wrapper


def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"TIMER LOG: {func.__name__} took {end - start:.6f} seconds")
        return result
    return wrapper


def access_required(role):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Перевірка авторизації
            username = input("Введіть ім'я користувача: ")

            # Зчитуємо користувачів з файлу
            try:
                with open("users.json", "r", encoding="utf-8") as f:
                    users = json.load(f)
            except FileNotFoundError:
                print("Файл users.json не знайдено!")
                sys.exit(1)

            # Шукаємо користувача
            user = next((u for u in users if u["name"] == username), None)
            if not user:
                raise PermissionError("Користувач не знайдений!")

            if user["access_right"] != role:
                raise PermissionError(f"Немає доступу! Потрібна роль '{role}', а у вас '{user['access_right']}'")

            print(f"Авторизація успішна: {username} ({user['access_right']})")
            return func(*args, **kwargs)
        return wrapper
    return decorator


def sort_result(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return sorted(result)
    return wrapper

@access_required("admin")
@sort_result
@timer
@logging_after
@logging_before
def get_shuffled_alphabet():
    alphabet = list(string.ascii_lowercase)  # список букв
    random.shuffle(alphabet)
    return alphabet


if __name__ == "__main__":
    try:
        result = get_shuffled_alphabet()
        print("Final result:", result)
    except PermissionError as e:
        print(e)
        sys.exit(1)