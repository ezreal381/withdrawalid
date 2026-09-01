import asyncio
import logging
from aiogram import Bot, Dispatcher, F
from aiogram.types import Message, ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from aiogram.filters import CommandStart
from aiogram.enums import ParseMode

# ================== CẤU HÌNH ==================
BOT_TOKEN = "8665990996:AAFvQ6PRiZI0NqyjvJJjV06pvos7jehhI8o"  # Lấy từ @BotFather
WEBAPP_URL = "https://ezreal381.github.io/withdrawalid/"  # Link WebApp của bạn (hoặc link GitHub Pages)

# ================== KHỞI TẠO ==================
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

# ================== KEYBOARD ==================
def get_main_keyboard():
    keyboard = ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="🔍 Nhập Withdrawal ID",
                    web_app=WebAppInfo(url=WEBAPP_URL)
                )
            ]
        ],
        resize_keyboard=True
    )
    return keyboard

# ================== HANDLERS ==================
@dp.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        "Chào bạn! Bấm nút bên dưới để nhập Withdrawal ID cần xác thực.",
        reply_markup=get_main_keyboard()
    )

# Bắt dữ liệu từ WebApp
@dp.message(F.web_app_data)
async def handle_web_app_data(message: Message):
    data = message.web_app_data.data.strip()
    logging.info(f"Nhận web_app_data: {data}")

    if data.startswith("/xt "):
        withdraw_id = data[4:].strip()
        
        # ========== XỬ LÝ XÁC THỰC TẠI ĐÂY ==========
        # Bạn thay phần này bằng logic kiểm tra ID thật của bạn
        await message.answer(
            f"✅ Đã nhận yêu cầu xác thực\n\n"
            f"**Withdrawal ID:** `{withdraw_id}`\n\n"
            f"Đang kiểm tra trạng thái...",
            parse_mode=ParseMode.MARKDOWN
        )
        
        # Ví dụ gọi hàm xử lý thật:
        # result = await check_withdrawal_status(withdraw_id)
        # await message.answer(result)
        
    else:
        await message.answer("❌ Dữ liệu không hợp lệ.")

# Bắt lệnh /xt thủ công (nếu người dùng gõ tay)
@dp.message(F.text.startswith("/xt "))
async def handle_xt_command(message: Message):
    withdraw_id = message.text[4:].strip()
    await message.answer(
        f"✅ Đã nhận lệnh\n\n**Withdrawal ID:** `{withdraw_id}`",
        parse_mode=ParseMode.MARKDOWN
    )

# ================== CHẠY BOT ==================
async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
