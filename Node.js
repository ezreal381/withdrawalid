const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('8665990996:AAFvQ6PRiZI0NqyjvJJjV06pvos7jehhI8o', { polling: true });

// 1. Hàm xử lý logic tra cứu ID (Dùng chung cho cả 2 cách)
async function processWithdraw(chatId, withdrawId) {
    // Trả tin nhắn xác nhận cho người dùng
    await bot.sendMessage(chatId, `⏳ Đang kiểm tra mã giao dịch: *${withdrawId}*...`, { parse_mode: 'Markdown' });

    // TODO: Đặt đoạn code gọi API kiểm tra dữ liệu rút tiền của bạn ở đây
}

// 2. Lắng nghe khi người dùng gõ trực tiếp: /xt <WithdrawalID>
bot.onText(/\/xt(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const withdrawId = match[1] ? match[1].trim() : null;

    if (withdrawId) {
        await processWithdraw(chatId, withdrawId);
    } else {
        await bot.sendMessage(chatId, "Cú pháp: `/xt <WithdrawalID>`\nVí dụ: `/xt W2026082800883505`", { parse_mode: 'Markdown' });
    }
});

// 3. LẮNG NGHE DỮ LIỆU TỪ WEB APP (QUAN TRỌNG NHẤT)
bot.on('message', async (msg) => {
    // Kiểm tra nếu tin nhắn đến từ việc nhấn nút "Xác Nhận" trên Web App
    if (msg.web_app_data) {
        try {
            const data = JSON.parse(msg.web_app_data.data);
            
            if (data.action === 'xt' && data.withdraw_id) {
                const withdrawId = data.withdraw_id;

                // Tự động hiển thị dòng lệnh /xt <ID> vào khung chat để giả lập hành vi
                await bot.sendMessage(msg.chat.id, `/xt ${withdrawId}`);

                // Gọi hàm xử lý tra cứu
                await processWithdraw(msg.chat.id, withdrawId);
            }
        } catch (error) {
            console.error("Lỗi đọc dữ liệu WebApp:", error);
        }
    }
});
