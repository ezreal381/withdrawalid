const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });

// 1. Hàm xử lý tra cứu rút tiền dùng chung
async function handleWithdrawVerification(chatId, withdrawId) {
    // Giả lập hiển thị tin nhắn phản hồi
    await bot.sendMessage(chatId, `⏳ Đang xác thực mã giao dịch: *${withdrawId}*...`, { parse_mode: 'Markdown' });

    // TODO: Đặt logic gọi API tra cứu dữ liệu thực tế tại đây
}

// 2. Lắng nghe khi người dùng gõ lệnh trực tiếp: /xt <WithdrawalID>
bot.onText(/\/xt(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const withdrawId = match[1] ? match[1].trim() : null;

    if (withdrawId) {
        await handleWithdrawVerification(chatId, withdrawId);
    } else {
        bot.sendMessage(chatId, "Cú pháp: `/xt <WithdrawalID>`\nVí dụ: `/xt W2026082800883505`", { parse_mode: 'Markdown' });
    }
});

// 3. Lắng nghe dữ liệu gửi từ Web App (Nút Menu -> Nhập ID -> Xác Nhận)
bot.on('message', async (msg) => {
    if (msg.web_app_data) {
        try {
            const data = JSON.parse(msg.web_app_data.data);
            if (data.action === 'xt' && data.withdraw_id) {
                // Tự động hiển thị lại tin nhắn giả lập người dùng vừa gửi lệnh
                await bot.sendMessage(msg.chat.id, `/xt ${data.withdraw_id}`);
                
                // Gọi hàm kiểm tra ID
                await handleWithdrawVerification(msg.chat.id, data.withdraw_id);
            }
        } catch (e) {
            console.error("Lỗi đọc dữ liệu WebApp:", e);
        }
    }
});
