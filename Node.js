// Khi gõ /start hoặc /xt mà không có ID, gửi nút Keyboard chứa Web App
bot.onText(/\/xt(?:\s+(.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const withdrawId = match[1] ? match[1].trim() : null;

    if (withdrawId) {
        // Xử lý nếu gõ trực tiếp /xt <ID>
        bot.sendMessage(chatId, `⏳ Đang kiểm tra mã giao dịch: *${withdrawId}*...`, { parse_mode: 'Markdown' });
    } else {
        // Gửi nút bấm Keyboard mở Web App (Chắc chắn gửi được sendData)
        bot.sendMessage(chatId, "Vui lòng bấm nút bên dưới để nhập Withdrawal ID:", {
            reply_markup: {
                keyboard: [
                    [{ text: "🔑 Nhập Withdrawal ID", web_app: { url: "https://ezreal381.github.io/withdrawalid/" } }]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }
});

// Lắng nghe dữ liệu gửi về từ Keyboard Web App
bot.on('message', async (msg) => {
    if (msg.web_app_data) {
        const data = JSON.parse(msg.web_app_data.data);
        if (data.action === 'xt') {
            const withdrawId = data.withdraw_id;
            
            // Tự động phản hồi kết quả vào khung chat
            await bot.sendMessage(msg.chat.id, `/xt ${withdrawId}`);
            await bot.sendMessage(msg.chat.id, `⏳ Đang kiểm tra mã giao dịch: *${withdrawId}*...`, { parse_mode: 'Markdown' });
        }
    }
});
