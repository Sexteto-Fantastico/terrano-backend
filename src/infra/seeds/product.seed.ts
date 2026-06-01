import { AppDataSource } from "../config/data-source";
import { Product } from "../entities/product.entity";
import { ProductCategory } from "../entities/product-category.entity";
import { ProductBrand } from "../entities/product-brand.entity";
import { MeasurementUnit } from "../entities/measurement-unit.entity";

export async function createProductSeed(): Promise<void> {
    const repository = AppDataSource.getRepository(Product);

    const categoryRepository = AppDataSource.getRepository(ProductCategory);
    const brandRepository = AppDataSource.getRepository(ProductBrand);
    const unitRepository = AppDataSource.getRepository(MeasurementUnit);

    const categories = await categoryRepository.find();
    const brands = await brandRepository.find();
    const units = await unitRepository.find();

    const getCategory = (name: string): ProductCategory => {
        const category = categories.find(c => c.name === name);

        if (!category) {
            throw new Error(
                `Category not found: "${name}". Available categories: ${categories
                    .map(c => c.name)
                    .join(", ")}`
            );
        }

        return category;
    };

    const getBrand = (name: string): ProductBrand => {
        const brand = brands.find(b => b.name === name);

        if (!brand) {
            throw new Error(
                `Brand not found: "${name}". Available brands: ${brands
                    .map(b => b.name)
                    .join(", ")}`
            );
        }

        return brand;
    };

    const getUnit = (name: string): MeasurementUnit => {
        const unit = units.find(u => u.name === name);

        if (!unit) {
            throw new Error(
                `Measurement unit not found: "${name}". Available units: ${units
                    .map(u => u.name)
                    .join(", ")}`
            );
        }

        return unit;
    };

    const products = [
        {
            code: "FER001",
            name: "Furadeira Bosch GSB 13 RE",
            category: getCategory("Ferramentas"),
            brand: getBrand("Bosch"),
            measurementUnit: getUnit("Unidade"),
            min_stock: 5,
            max_stock: 20,
        },
        {
            code: "FER002",
            name: "Parafusadeira Makita DF330D",
            category: getCategory("Ferramentas"),
            brand: getBrand("Makita"),
            measurementUnit: getUnit("Unidade"),
            min_stock: 5,
            max_stock: 15,
        },
        {
            code: "EPI001",
            name: "Capacete de Segurança",
            category: getCategory("EPIs"),
            brand: getBrand("3M"),
            measurementUnit: getUnit("Unidade"),
            min_stock: 20,
            max_stock: 100,
        },
        {
            code: "EPI002",
            name: "Óculos de Proteção",
            category: getCategory("EPIs"),
            brand: getBrand("3M"),
            measurementUnit: getUnit("Unidade"),
            min_stock: 20,
            max_stock: 100,
        },
        {
            code: "ELE001",
            name: "Disjuntor 20A",
            category: getCategory("Material Elétrico"),
            brand: getBrand("Schneider Electric"),
            measurementUnit: getUnit("Unidade"),
            min_stock: 10,
            max_stock: 50,
        },
        {
            code: "ELE002",
            name: "Tomada 20A",
            category: getCategory("Material Elétrico"),
            brand: getBrand("Legrand"),
            measurementUnit: getUnit("Unidade"),
            min_stock: 20,
            max_stock: 100,
        },
        {
            code: "HID001",
            name: "Tubo PVC 50mm",
            category: getCategory("Material Hidráulico"),
            brand: getBrand("Tigre"),
            measurementUnit: getUnit("Metro"),
            min_stock: 50,
            max_stock: 300,
        },
        {
            code: "HID002",
            name: "Registro Esfera 1/2",
            category: getCategory("Material Hidráulico"),
            brand: getBrand("Amanco"),
            measurementUnit: getUnit("Unidade"),
            min_stock: 10,
            max_stock: 50,
        },
        {
            code: "INF001",
            name: "Switch 24 Portas",
            category: getCategory("Informática"),
            brand: getBrand("Intelbras"),
            measurementUnit: getUnit("Unidade"),
            min_stock: 2,
            max_stock: 10,
        },
        {
            code: "INF002",
            name: "Cabo de Rede Cat6",
            category: getCategory("Informática"),
            brand: getBrand("Furukawa"),
            measurementUnit: getUnit("Metro"),
            min_stock: 100,
            max_stock: 1000,
        },
    ];

    for (const productData of products) {
        const exists = await repository.findOne({
            where: {
                code: productData.code,
            },
        });

        if (exists) {
            continue;
        }

        const product = repository.create({
            code: productData.code,
            name: productData.name,
            category_id: productData.category.id,
            brand_id: productData.brand.id,
            measurement_unit_id: productData.measurementUnit.id,
            min_stock: productData.min_stock,
            max_stock: productData.max_stock,
        });

        await repository.save(product);
    }

    console.log("Product seed completed");
}