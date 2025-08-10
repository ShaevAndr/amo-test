import { db } from './connection';
import { contacts, leads } from './schema';

async function migrate() {
  // Создание таблиц, если не существуют
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amocrm_id INT NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(32) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX phone_idx (phone)
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS leads (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amocrm_id INT NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      status VARCHAR(64) NOT NULL,
      contact_id INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX contact_idx (contact_id),
      FOREIGN KEY (contact_id) REFERENCES contacts(id)
    );
  `);
  console.log('Migration complete');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
