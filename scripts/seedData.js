const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/category');
const Cap = require('../models/cap');
const User = require('../models/user');

// Configurar variables de entorno
dotenv.config();

// Datos de categorías (equipos)
const categoriesData = [
    {
        name: 'New York Yankees',
        description: 'Equipo de béisbol profesional de la MLB con sede en Nueva York',
        league: 'MLB',
        foundedYear: 1901,
        city: 'Nueva York',
        colors: ['Azul marino', 'Blanco'],
        logo: '/images/logos/yankees.png'
    },
    {
        name: 'Los Angeles Dodgers',
        description: 'Equipo de béisbol profesional de la MLB con sede en Los Angeles',
        league: 'MLB',
        foundedYear: 1883,
        city: 'Los Angeles',
        colors: ['Azul', 'Blanco'],
        logo: '/images/logos/dodgers.png'
    },
    {
        name: 'Boston Red Sox',
        description: 'Equipo de béisbol profesional de la MLB con sede en Boston',
        league: 'MLB',
        foundedYear: 1901,
        city: 'Boston',
        colors: ['Rojo', 'Azul marino', 'Blanco'],
        logo: '/images/logos/redsox.png'
    },
    {
        name: 'Chicago Cubs',
        description: 'Equipo de béisbol profesional de la MLB con sede en Chicago',
        league: 'MLB',
        foundedYear: 1876,
        city: 'Chicago',
        colors: ['Azul', 'Rojo', 'Blanco'],
        logo: '/images/logos/cubs.png'
    },
    {
        name: 'San Francisco Giants',
        description: 'Equipo de béisbol profesional de la MLB con sede en San Francisco',
        league: 'MLB',
        foundedYear: 1883,
        city: 'San Francisco',
        colors: ['Negro', 'Naranja'],
        logo: '/images/logos/giants.png'
    }
];

// Función para crear admin inicial
const seedAdmin = async () => {
    try {
        // Limpiar usuarios existentes
        await User.deleteMany({});
        console.log('🗑️ Usuarios existentes eliminados');

        // Crear admin por defecto
        const adminUser = new User({
            name: 'Administrador RRCaps',
            email: 'admin@rrcaps.com',
            password: 'admin123',
            role: 'admin'
        });

        await adminUser.save();
        console.log('✅ Usuario admin creado: admin@rrcaps.com / admin123');
        
        return adminUser;
    } catch (error) {
        console.error('❌ Error al crear admin:', error);
        throw error;
    }
};
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'gorrasDB',
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

// Función para poblar las categorías
const seedCategories = async () => {
    try {
        // Limpiar categorías existentes
        await Category.deleteMany({});
        console.log('🗑️ Categorías existentes eliminadas');

        // Insertar nuevas categorías
        const categories = await Category.insertMany(categoriesData);
        console.log(`✅ ${categories.length} categorías insertadas`);
        
        return categories;
    } catch (error) {
        console.error('❌ Error al poblar categorías:', error);
        throw error;
    }
};

// Función para poblar las gorras
const seedCaps = async (categories) => {
    try {
        // Limpiar gorras existentes
        await Cap.deleteMany({});
        console.log('🗑️ Gorras existentes eliminadas');

        const capsData = [
            {
                name: 'Gorra Yankees Clásica Negra',
                description: 'Gorra clásica de los New York Yankees en color negro con logo bordado',
                price: 65000,
                image: '/images/caps/yankees-black-classic.jpg',
                category: categories.find(c => c.name === 'New York Yankees')._id,
                stock: 25,
                size: 'Ajustable',
                material: 'Algodón'
            },
            {
                name: 'Gorra Yankees Azul Marino',
                description: 'Gorra azul marino de los Yankees con visera curva',
                price: 68000,
                image: '/images/caps/yankees-navy.jpg',
                category: categories.find(c => c.name === 'New York Yankees')._id,
                stock: 30,
                size: 'Ajustable',
                material: 'Poliéster'
            },
            {
                name: 'Gorra Dodgers Azul Clásica',
                description: 'Gorra azul clásica de los Los Angeles Dodgers',
                price: 70000,
                image: '/images/caps/dodgers-blue-classic.jpg',
                category: categories.find(c => c.name === 'Los Angeles Dodgers')._id,
                stock: 20,
                size: 'Ajustable',
                material: 'Algodón'
            },
            {
                name: 'Gorra Dodgers Blanca',
                description: 'Gorra blanca de los Dodgers con logo azul',
                price: 72000,
                image: '/images/caps/dodgers-white.jpg',
                category: categories.find(c => c.name === 'Los Angeles Dodgers')._id,
                stock: 18,
                size: 'L',
                material: 'Algodón'
            },
            {
                name: 'Gorra Red Sox Roja',
                description: 'Gorra roja clásica de los Boston Red Sox',
                price: 69000,
                image: '/images/caps/redsox-red.jpg',
                category: categories.find(c => c.name === 'Boston Red Sox')._id,
                stock: 22,
                size: 'Ajustable',
                material: 'Algodón'
            },
            {
                name: 'Gorra Red Sox Azul Marino',
                description: 'Gorra azul marino de los Red Sox con logo rojo',
                price: 71000,
                image: '/images/caps/redsox-navy.jpg',
                category: categories.find(c => c.name === 'Boston Red Sox')._id,
                stock: 15,
                size: 'M',
                material: 'Poliéster'
            },
            {
                name: 'Gorra Cubs Azul Real',
                description: 'Gorra azul real de los Chicago Cubs',
                price: 73000,
                image: '/images/caps/cubs-royal-blue.jpg',
                category: categories.find(c => c.name === 'Chicago Cubs')._id,
                stock: 28,
                size: 'Ajustable',
                material: 'Algodón'
            },
            {
                name: 'Gorra Giants Negra',
                description: 'Gorra negra de los San Francisco Giants con logo naranja',
                price: 67000,
                image: '/images/caps/giants-black.jpg',
                category: categories.find(c => c.name === 'San Francisco Giants')._id,
                stock: 24,
                size: 'Ajustable',
                material: 'Algodón'
            },
            {
                name: 'Gorra Giants Naranja',
                description: 'Gorra naranja de los Giants con logo negro',
                price: 69000,
                image: '/images/caps/giants-orange.jpg',
                category: categories.find(c => c.name === 'San Francisco Giants')._id,
                stock: 19,
                size: 'L',
                material: 'Poliéster'
            }
        ];

        const caps = await Cap.insertMany(capsData);
        console.log(`✅ ${caps.length} gorras insertadas`);
        
        return caps;
    } catch (error) {
        console.error('❌ Error al poblar gorras:', error);
        throw error;
    }
};

// Función principal
const seedDatabase = async () => {
    try {
        console.log('🌱 Iniciando población de la base de datos...');
        
        await connectDB();
        
        const admin = await seedAdmin();
        const categories = await seedCategories();
        const caps = await seedCaps(categories);
        
        console.log('✅ Base de datos poblada exitosamente');
        console.log(`📊 Resumen: 1 admin, ${categories.length} categorías, ${caps.length} gorras`);
        console.log('🔑 Login admin: admin@rrcaps.com / admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la población de la base de datos:', error);
        process.exit(1);
    }
};

// Ejecutar el script
seedDatabase();