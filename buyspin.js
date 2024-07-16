const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

(async () => {
    try {
        const initData = await askQuestion('Masukkan Initdata: ');
        const secret = await askQuestion('Masukkan Secret: ');
        const tgId = await askQuestion('Masukkan Tg-Id: ');
        const username = await askQuestion('Masukkan Username: ');
        const login = await axios.get('https://api-clicker.pixelverse.xyz/api/users', {
            headers: {
                'Initdata': initData,
                'Secret': secret,
                'Tg-Id': tgId,
                'Username': username
            }
        });

        console.log('');
        console.log('\x1b[2m=== Informasi Akun ===\x1b[0m');
        console.log('\x1b[0mUsername:\x1b[33m', username);
        console.log('\x1b[0mTelegramID:\x1b[33m', login.data.telegramUserId);
        console.log('\x1b[0mBalance:\x1b[33m', login.data.clicksCount);
        console.log('');
        console.log('Ketika ingin keluar dari bot maka pencet ctrl+c atau exit langsung program');
        console.log('');
        const proceed = await askQuestion('Lanjutkan bug buy? (y/n): ');

        if (proceed.toLowerCase() === 'y') {
            console.log('Mulai pembelian pet...\n');

            let running = true;
            const concurrency = 20; // Jumlah permintaan simultan
            const buyPet = async () => {
                while (running) {
                    try {
                        const response = await axios.post('https://api-clicker.pixelverse.xyz/api/shop/items/ROULETTE_SPINS_COINS_2/buy', {}, {
                            headers: {
                                'Initdata': initData,
                                'Secret': secret,
                                'Tg-Id': tgId,
                                'Username': username
                            }
                        });
                        console.log(`\x1b[32mSukses`);
                    } catch (error) {
                        console.log('\x1b[31mGagal!\x1b[0m');
                    }
                }
            };

            const workers = Array(concurrency).fill(null).map(buyPet);

            process.on('SIGINT', () => {
                running = false;
                console.log('\nProgram dihentikan.');
                rl.close();
                process.exit();
            });

            await Promise.all(workers);
        } else {
            console.log('Program selesai.');
            rl.close();
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        rl.close();
    }
})();