import pandas as pd
import numpy as np

# Mengatur seed untuk hasil yang reproducible
np.random.seed(42)

# Fungsi untuk menghasilkan nama mahasiswa acak
def generate_name(index):
    return f'Mahasiswa{index+1}'

# Menghasilkan data acak untuk IPK (antara 2.0 sampai 4.0)
ipk = np.random.uniform(0, 4.0, 5000)

# Menghasilkan data acak untuk skor psikologi (antara 50 sampai 100)
skor_psikologi = np.random.randint(0, 101, 5000)

# Menghasilkan data acak untuk status finansial (0 = tidak membutuhkan, 1 = membutuhkan)
finansial = np.random.randint(0, 2, 5000)

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

# Membuat DataFrame
data = {
    'Nama': [generate_name(i) for i in range(5000)],
    'IPK': ipk,
    'Skor_Psikologi': skor_psikologi,
    'Finansial': finansial,
    'Status': status
}

df = pd.DataFrame(data)

# Menampilkan 5 baris pertama dari dataset
print(df.head())

# Menyimpan dataset ke file CSV jika diperlukan
df.to_csv('dataset_mahasiswa_5000.csv', index=False)

# Tampilkan sebagian dataset untuk konfirmasi
print(df.head())
