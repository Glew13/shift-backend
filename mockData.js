// Enhanced mock data with 100 realistic UK cars
function getEnhancedMockData(searchQuery = '') {
    const allCars = [
        // BMW (15 cars)
        {
            title: "BMW 520d M Sport Touring",
            price: "£29,950",
            year: "2021",
            mileage: "18,500 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
        },
        {
            title: "BMW 530d xDrive M Sport Touring",
            price: "£32,995",
            year: "2021",
            mileage: "22,100 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"
        },
        {
            title: "BMW 320d M Sport Touring",
            price: "£24,750",
            year: "2020",
            mileage: "28,400 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617531653520-bd4f96b6e3bf?w=800"
        },
        {
            title: "BMW 330e M Sport Saloon",
            price: "£27,995",
            year: "2020",
            mileage: "19,800 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
        },
        {
            title: "BMW X3 xDrive20d M Sport",
            price: "£31,750",
            year: "2021",
            mileage: "16,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"
        },
        {
            title: "BMW X5 xDrive30d M Sport",
            price: "£42,995",
            year: "2021",
            mileage: "24,500 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617531653520-bd4f96b6e3bf?w=800"
        },
        {
            title: "BMW 420d M Sport Coupe",
            price: "£26,750",
            year: "2020",
            mileage: "21,300 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
        },
        {
            title: "BMW 118i M Sport Hatchback",
            price: "£19,995",
            year: "2019",
            mileage: "32,400 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"
        },
        {
            title: "BMW 218i Gran Tourer M Sport",
            price: "£22,750",
            year: "2020",
            mileage: "18,900 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617531653520-bd4f96b6e3bf?w=800"
        },
        {
            title: "BMW M240i Coupe",
            price: "£34,995",
            year: "2021",
            mileage: "12,100 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
        },
        {
            title: "BMW 730d M Sport Saloon",
            price: "£48,750",
            year: "2022",
            mileage: "8,500 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"
        },
        {
            title: "BMW X1 sDrive18d Sport",
            price: "£23,995",
            year: "2020",
            mileage: "26,700 miles",
            fuel: "Diesel",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1617531653520-bd4f96b6e3bf?w=800"
        },
        {
            title: "BMW 220d M Sport Active Tourer",
            price: "£21,750",
            year: "2019",
            mileage: "29,800 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800"
        },
        {
            title: "BMW 440i M Sport Gran Coupe",
            price: "£32,750",
            year: "2021",
            mileage: "15,400 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800"
        },
        {
            title: "BMW Z4 sDrive20i M Sport",
            price: "£36,995",
            year: "2022",
            mileage: "6,200 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617531653520-bd4f96b6e3bf?w=800"
        },

        // Audi (15 cars)
        {
            title: "Audi A4 Avant S Line",
            price: "£27,500",
            year: "2020",
            mileage: "22,000 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        },
        {
            title: "Audi A6 Avant Black Edition",
            price: "£33,995",
            year: "2021",
            mileage: "19,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800"
        },
        {
            title: "Audi Q5 S Line",
            price: "£34,750",
            year: "2021",
            mileage: "16,800 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        },
        {
            title: "Audi A3 Sportback S Line",
            price: "£22,995",
            year: "2020",
            mileage: "24,300 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800"
        },
        {
            title: "Audi Q3 S Line Edition",
            price: "£28,750",
            year: "2021",
            mileage: "14,500 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        },
        {
            title: "Audi A5 Sportback S Line",
            price: "£31,995",
            year: "2021",
            mileage: "18,900 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800"
        },
        {
            title: "Audi Q7 S Line",
            price: "£44,995",
            year: "2021",
            mileage: "21,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        },
        {
            title: "Audi TT Coupe S Line",
            price: "£29,750",
            year: "2020",
            mileage: "17,600 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800"
        },
        {
            title: "Audi A1 Sportback S Line",
            price: "£18,995",
            year: "2019",
            mileage: "28,400 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        },
        {
            title: "Audi A7 Sportback Black Edition",
            price: "£42,750",
            year: "2022",
            mileage: "9,800 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800"
        },
        {
            title: "Audi Q2 Sport",
            price: "£21,995",
            year: "2020",
            mileage: "19,300 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        },
        {
            title: "Audi A8 L Black Edition",
            price: "£52,995",
            year: "2022",
            mileage: "7,100 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800"
        },
        {
            title: "Audi Q8 S Line",
            price: "£58,750",
            year: "2022",
            mileage: "11,400 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        },
        {
            title: "Audi e-tron 55 quattro S Line",
            price: "£46,995",
            year: "2021",
            mileage: "15,800 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800"
        },
        {
            title: "Audi RS3 Sportback",
            price: "£48,750",
            year: "2022",
            mileage: "5,200 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800"
        },

        // Mercedes-Benz (15 cars)
        {
            title: "Mercedes-Benz C220d Estate AMG Line",
            price: "£31,995",
            year: "2021",
            mileage: "15,000 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
        },
        {
            title: "Mercedes-Benz E220d Estate AMG Line Premium",
            price: "£36,750",
            year: "2022",
            mileage: "12,500 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Mercedes-Benz GLC 220d AMG Line",
            price: "£38,995",
            year: "2021",
            mileage: "17,300 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
        },
        {
            title: "Mercedes-Benz A200 AMG Line Premium",
            price: "£25,750",
            year: "2020",
            mileage: "21,800 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Mercedes-Benz CLA 220 AMG Line",
            price: "£29,995",
            year: "2021",
            mileage: "14,200 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
        },
        {
            title: "Mercedes-Benz GLE 300d AMG Line",
            price: "£52,750",
            year: "2022",
            mileage: "9,600 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Mercedes-Benz S350d L AMG Line Premium",
            price: "£64,995",
            year: "2022",
            mileage: "6,400 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
        },
        {
            title: "Mercedes-Benz B200d AMG Line",
            price: "£26,750",
            year: "2020",
            mileage: "23,100 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Mercedes-Benz GLA 200 AMG Line",
            price: "£28,995",
            year: "2021",
            mileage: "16,700 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
        },
        {
            title: "Mercedes-Benz C300e AMG Line Estate",
            price: "£33,750",
            year: "2021",
            mileage: "18,900 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Mercedes-Benz GLB 220d AMG Line",
            price: "£36,995",
            year: "2021",
            mileage: "15,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
        },
        {
            title: "Mercedes-Benz EQC 400 AMG Line",
            price: "£49,750",
            year: "2021",
            mileage: "12,800 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Mercedes-Benz C43 AMG Estate",
            price: "£44,995",
            year: "2021",
            mileage: "11,500 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
        },
        {
            title: "Mercedes-Benz SLC 200 AMG Line",
            price: "£32,750",
            year: "2020",
            mileage: "14,300 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Mercedes-Benz V220d AMG Line",
            price: "£42,995",
            year: "2021",
            mileage: "19,600 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800"
        },

        // Volkswagen (10 cars)
        {
            title: "Volkswagen Passat Estate GT",
            price: "£25,750",
            year: "2020",
            mileage: "24,500 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1552519507-0dc9e1976c5f?w=800"
        },
        {
            title: "Volkswagen Golf GTI",
            price: "£27,995",
            year: "2021",
            mileage: "15,800 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1622353219448-46a87c2948f5?w=800"
        },
        {
            title: "Volkswagen Tiguan R-Line",
            price: "£29,750",
            year: "2021",
            mileage: "18,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1552519507-0dc9e1976c5f?w=800"
        },
        {
            title: "Volkswagen Polo R-Line",
            price: "£17,995",
            year: "2020",
            mileage: "21,400 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1622353219448-46a87c2948f5?w=800"
        },
        {
            title: "Volkswagen Arteon R-Line",
            price: "£32,750",
            year: "2021",
            mileage: "16,900 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1552519507-0dc9e1976c5f?w=800"
        },
        {
            title: "Volkswagen T-Roc R-Line",
            price: "£24,995",
            year: "2020",
            mileage: "19,700 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1622353219448-46a87c2948f5?w=800"
        },
        {
            title: "Volkswagen ID.4 Pro Performance",
            price: "£36,995",
            year: "2022",
            mileage: "8,300 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1552519507-0dc9e1976c5f?w=800"
        },
        {
            title: "Volkswagen Touareg R-Line Tech",
            price: "£48,750",
            year: "2022",
            mileage: "11,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1622353219448-46a87c2948f5?w=800"
        },
        {
            title: "Volkswagen Golf R Estate",
            price: "£36,995",
            year: "2021",
            mileage: "12,600 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1552519507-0dc9e1976c5f?w=800"
        },
        {
            title: "Volkswagen Up! GTI",
            price: "£14,750",
            year: "2019",
            mileage: "26,800 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1622353219448-46a87c2948f5?w=800"
        },

        // Volvo (8 cars)
        {
            title: "Volvo V60 R-Design",
            price: "£28,500",
            year: "2020",
            mileage: "19,800 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
        },
        {
            title: "Volvo V90 Cross Country",
            price: "£34,995",
            year: "2021",
            mileage: "16,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
        },
        {
            title: "Volvo XC40 R-Design",
            price: "£29,750",
            year: "2021",
            mileage: "14,500 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
        },
        {
            title: "Volvo XC60 R-Design Pro",
            price: "£36,995",
            year: "2021",
            mileage: "17,800 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
        },
        {
            title: "Volvo XC90 R-Design Pro",
            price: "£48,750",
            year: "2022",
            mileage: "9,400 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
        },
        {
            title: "Volvo S90 R-Design",
            price: "£34,995",
            year: "2021",
            mileage: "13,600 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
        },
        {
            title: "Volvo V40 R-Design Pro",
            price: "£19,995",
            year: "2019",
            mileage: "28,300 miles",
            fuel: "Diesel",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800"
        },
        {
            title: "Volvo XC40 Recharge Pure Electric",
            price: "£42,750",
            year: "2022",
            mileage: "7,900 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800"
        },

        // Ford (8 cars)
        {
            title: "Ford Focus ST-Line",
            price: "£18,995",
            year: "2020",
            mileage: "26,400 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800"
        },
        {
            title: "Ford Fiesta ST-Line",
            price: "£14,750",
            year: "2019",
            mileage: "32,100 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800"
        },
        {
            title: "Ford Kuga ST-Line",
            price: "£24,995",
            year: "2021",
            mileage: "17,600 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800"
        },
        {
            title: "Ford Puma ST-Line Vignale",
            price: "£22,750",
            year: "2021",
            mileage: "14,200 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800"
        },
        {
            title: "Ford Mustang GT",
            price: "£32,995",
            year: "2020",
            mileage: "18,900 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1584345604476-8ec5f6fd900d?w=800"
        },
        {
            title: "Ford Ranger Wildtrak",
            price: "£28,750",
            year: "2021",
            mileage: "22,300 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800"
        },
        {
            title: "Ford Mustang Mach-E Extended Range",
            price: "£44,995",
            year: "2022",
            mileage: "6,700 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800"
        },
        {
            title: "Ford Galaxy Titanium",
            price: "£21,995",
            year: "2020",
            mileage: "28,500 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800"
        },

        // Kia / Hyundai (8 cars)
        {
            title: "Kia Sportage GT-Line",
            price: "£21,995",
            year: "2021",
            mileage: "14,800 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Hyundai Tucson Premium",
            price: "£23,750",
            year: "2021",
            mileage: "16,500 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Kia EV6 GT-Line",
            price: "£42,995",
            year: "2022",
            mileage: "5,200 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Hyundai Ioniq 5 Premium",
            price: "£39,750",
            year: "2022",
            mileage: "7,800 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Kia Sorento GT-Line S",
            price: "£32,995",
            year: "2021",
            mileage: "18,600 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Hyundai Santa Fe Premium",
            price: "£31,750",
            year: "2021",
            mileage: "19,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Kia Stinger GT-Line S",
            price: "£28,995",
            year: "2020",
            mileage: "21,400 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Hyundai Kona Electric Premium",
            price: "£26,750",
            year: "2021",
            mileage: "12,900 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },

        // Mazda / Nissan / Toyota / Honda (12 cars)
        {
            title: "Mazda MX-5 Sport",
            price: "£18,750",
            year: "2019",
            mileage: "22,400 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800"
        },
        {
            title: "Mazda CX-5 Sport",
            price: "£24,995",
            year: "2021",
            mileage: "16,700 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Nissan Qashqai Tekna",
            price: "£22,750",
            year: "2021",
            mileage: "18,300 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Nissan Juke Tekna",
            price: "£18,995",
            year: "2020",
            mileage: "24,600 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Nissan Leaf e+ Tekna",
            price: "£24,750",
            year: "2021",
            mileage: "11,400 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Toyota RAV4 Design",
            price: "£28,995",
            year: "2021",
            mileage: "15,800 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Toyota Corolla Design",
            price: "£19,750",
            year: "2020",
            mileage: "21,200 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Toyota Yaris GR",
            price: "£32,995",
            year: "2021",
            mileage: "8,600 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Honda Civic Type R GT",
            price: "£34,750",
            year: "2021",
            mileage: "12,300 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Honda CR-V SR",
            price: "£26,995",
            year: "2021",
            mileage: "17,900 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },
        {
            title: "Honda Jazz Crosstar",
            price: "£18,750",
            year: "2020",
            mileage: "19,400 miles",
            fuel: "Hybrid",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Toyota GT86",
            price: "£19,995",
            year: "2019",
            mileage: "26,800 miles",
            fuel: "Petrol",
            transmission: "Manual",
            image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800"
        },

        // Tesla / Porsche / Jaguar / Land Rover (9 cars)
        {
            title: "Tesla Model 3 Long Range",
            price: "£38,995",
            year: "2022",
            mileage: "8,200 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800"
        },
        {
            title: "Tesla Model Y Long Range",
            price: "£46,750",
            year: "2022",
            mileage: "6,500 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800"
        },
        {
            title: "Porsche Cayenne S",
            price: "£62,995",
            year: "2022",
            mileage: "9,100 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=800"
        },
        {
            title: "Porsche Macan S",
            price: "£48,750",
            year: "2021",
            mileage: "14,800 miles",
            fuel: "Petrol",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=800"
        },
        {
            title: "Jaguar F-Pace R-Dynamic S",
            price: "£42,995",
            year: "2021",
            mileage: "16,300 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"
        },
        {
            title: "Jaguar I-Pace EV400",
            price: "£44,750",
            year: "2021",
            mileage: "12,600 miles",
            fuel: "Electric",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Land Rover Discovery Sport R-Dynamic SE",
            price: "£36,995",
            year: "2021",
            mileage: "18,700 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"
        },
        {
            title: "Land Rover Range Rover Evoque R-Dynamic S",
            price: "£38,750",
            year: "2021",
            mileage: "15,200 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1617654112368-307921291f42?w=800"
        },
        {
            title: "Land Rover Defender 110 X-Dynamic SE",
            price: "£58,995",
            year: "2022",
            mileage: "7,800 miles",
            fuel: "Diesel",
            transmission: "Automatic",
            image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"
        }
    ];
    
    // Filter based on search query if provided
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const filtered = allCars.filter(car => {
            const carText = `${car.title} ${car.fuel} ${car.transmission}`.toLowerCase();
            
            // Extract make from query
            const makes = ['bmw', 'audi', 'mercedes', 'volkswagen', 'vw', 'volvo', 'ford', 'kia', 
                          'hyundai', 'mazda', 'nissan', 'toyota', 'honda', 'tesla', 'porsche', 
                          'jaguar', 'land rover', 'range rover'];
            
            let makeFilter = null;
            for (const make of makes) {
                if (query.includes(make)) {
                    makeFilter = make;
                    break;
                }
            }
            
            if (makeFilter) {
                if (makeFilter === 'vw') makeFilter = 'volkswagen';
                if (makeFilter === 'range rover') makeFilter = 'land rover';
                if (!carText.includes(makeFilter)) return false;
            }
            
            // Filter by fuel type
            if (query.includes('diesel') && car.fuel !== 'Diesel') return false;
            if (query.includes('electric') && car.fuel !== 'Electric') return false;
            if ((query.includes('petrol') && !query.includes('hybrid')) && car.fuel !== 'Petrol') return false;
            if (query.includes('hybrid') && car.fuel !== 'Hybrid') return false;
            if (query.includes(' ev ') && car.fuel !== 'Electric') return false;
            
            // Filter by transmission
            if (query.includes('manual') && car.transmission !== 'Manual') return false;
            if (query.includes('automatic') && car.transmission !== 'Automatic') return false;
            
            // Filter by body type
            if ((query.includes('estate') || query.includes('touring')) && !carText.includes('estate') && !carText.includes('touring')) return false;
            if (query.includes('suv') && !carText.match(/x\d|q\d|glc|gle|touareg|cayenne|macan|f-pace|discovery|evoque|defender|sportage|tucson|santa fe|sorento|cx-5|qashqai|rav4/i)) return false;
            
            // Filter by price
            const priceMatch = query.match(/£(\d+)[k]?/);
            if (priceMatch) {
                let maxPrice = parseInt(priceMatch[1]);
                if (query.includes('k')) maxPrice *= 1000;
                
                const carPrice = parseInt(car.price.replace(/[£,]/g, ''));
                if (query.includes('under') || query.includes('less than')) {
                    if (carPrice > maxPrice) return false;
                }
            }
            
            return true;
        });
        
        // Return filtered results, or all if no matches
        return filtered.length > 0 ? filtered.slice(0, 15) : allCars.slice(0, 15);
    }
    
    // Return random selection if no query
    return allCars
        .sort(() => Math.random() - 0.5)
        .slice(0, 15);
}

module.exports = { getEnhancedMockData };
