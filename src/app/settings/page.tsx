import Link from 'next/link';
import { User, Bell, Shield, Moon, Globe, LogOut } from 'lucide-react';
import styles from './Settings.module.css';

export default function SettingsPage() {
    const settings = [
        { icon: User, label: 'Profiili', desc: 'Hallitse tiliäsi ja mieltymyksiäsi', href: '/profile' },
        { icon: Bell, label: 'Ilmoitukset', desc: 'Säädä ruuanlaittoilmoituksia', href: '/settings/notifications' },
        { icon: Shield, label: 'Tietoturva', desc: 'Salasana ja tilin suojaus', href: '/settings/security' },
        { icon: Globe, label: 'Kieli', desc: 'Suomi (Valittu)', href: '/settings/language' },
        { icon: Moon, label: 'Ulkoasu', desc: 'Tumma tila (Automaattinen)', href: '/settings/appearance' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className="title-gradient">Asetukset</h1>
                <p className={styles.subtitle}>Personoi keittiökokemuksesi</p>
            </header>

            <div className={styles.grid}>
                {settings.map((item, index) => (
                    <Link href={item.href} key={index} className={styles.settingItem}>
                        <div className={styles.iconBox}>
                            <item.icon size={24} />
                        </div>
                        <div className={styles.info}>
                            <h3>{item.label}</h3>
                            <p>{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
