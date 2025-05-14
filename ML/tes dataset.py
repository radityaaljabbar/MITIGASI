import pandas as pd
import numpy as np

# Mengatur seed untuk hasil yang reproducible
np.random.seed(42)

# Fungsi untuk menghasilkan nama mahasiswa acak
def generate_name(index):
    return f'Mahasiswa{index+1}'

# Menghasilkan data acak untuk IPK (antara 2.0 sampai 4.0)
ipk = np.random.uniform(2.0, 4.0, 5000)

# Menghasilkan data acak untuk skor psikologi (antara 50 sampai 100)
skor_psikologi = np.random.randint(50, 101, 5000)

# Menghasilkan data acak untuk status finansial (0 = tidak membutuhkan, 1 = membutuhkan)
finansial = np.random.randint(0, 2, 5000)

# Menambahkan noise pada IPK, Skor Psikologi, dan Finansial
ipk_noise = np.random.normal(0, 0.1, 5000)  # Noise kecil pada IPK
skor_psikologi_noise = np.random.normal(0, 3, 5000)  # Noise kecil pada Skor Psikologi
finansial_noise = np.random.randint(0, 2, 5000)  # Noise pada status finansial

ipk += ipk_noise  # Menambahkan noise ke IPK
skor_psikologi += np.round(skor_psikologi_noise).astype(int)  # Menambahkan noise ke Skor Psikologi (tetap integer)

# Menentukan status berdasarkan IPK, skor psikologi, dan status finansial
status = []
for i in range(5000):
    if ipk[i] >= 3.0 and skor_psikologi[i] >= 70:
        status.append('Aman')
    elif 2.5 <= ipk[i] < 3.0 and 55 <= skor_psikologi[i] < 70:
        # Menambahkan logika jika mahasiswa membutuhkan bantuan finansial
        if finansial[i] == 1:
            status.append('Siaga')
        else:
            status.append('Aman')
    elif ipk[i] < 2.5 or skor_psikologi[i] < 55:
        # Kondisi Bermasalah jika mahasiswa memiliki IPK atau skor psikologi rendah
        if finansial[i] == 1:
            status.append('Bermasalah')
        else:
            status.append('Siaga')
    else:
        status.append('Siaga')

# Menambahkan noise pada label status (misalnya 5% data salah labelnya)
num_noisy_labels = int(0.05 * len(status))  # 5% data noisy
noisy_indices = np.random.choice(len(status), num_noisy_labels, replace=False)

for idx in noisy_indices:
    original_status = status[idx]
    # Ubah label ke status yang berbeda secara acak
    new_status = np.random.choice([s for s in ['Aman', 'Siaga', 'Bermasalah'] if s != original_status])
    status[idx] = new_status

# Membuat DataFrame
data = {
    'Nama': [generate_name(i) for i in range(5000)],
    'IPK': ipk,
    'Skor_Psikologi': skor_psikologi,
    'Finansial': finansial,
    'Status': status
}

df = pd.DataFrame(data)

# Menyimpan dataset ke file CSV jika diperlukan
df.to_csv('dataset_mahasiswa_5000_noisy.csv', index=False)

# Menampilkan 5 baris pertama dari dataset untuk konfirmasi
print(df.head())
