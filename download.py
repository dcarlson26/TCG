import requests
from collections import defaultdict

pokemon_category = '3'

# Open the file in write mode ('w' to overwrite or 'a' to append)
with open("data.txt", "w") as file:
    try:
        r = requests.get(f"https://tcgcsv.com/tcgplayer/{pokemon_category}/groups")
        r.raise_for_status()  # Will raise an exception for HTTP errors
        all_groups = r.json().get('results', [])
        
        if not all_groups:
            file.write("No groups found\n")
        
        for group in all_groups:
            
            group_id = group['groupId']
            #Perfect Order Only for testing
            #if group_id != 24587:
            #    continue
            
            #SW+SH onwards
            if group_id < 2545: 
                continue
                
            try:
                # Fetch products for the group
                r = requests.get(f"https://tcgcsv.com/tcgplayer/{pokemon_category}/{group_id}/products")
                r.raise_for_status()
                products = r.json().get('results', [])
                if not products:
                    file.write(f"No products found for group {group_id}\n")
                
                #for product in products:
                #    file.write(f"{product['productId']} - {product['name']}\n")
                # Build lookup: id -> list of name entries
                name_lookup = defaultdict(list)
                img_lookup = defaultdict(list)
                for product in products:
                    name_lookup[product['productId']].append(product['name'])  
                    img_lookup[product['productId']].append(product['imageUrl'])

            except Exception as e:
                file.write(f"Failed to fetch products for group {group_id}: {e}\n")
            
            try:
                # Fetch prices for the group
                r = requests.get(f"https://tcgcsv.com/tcgplayer/{pokemon_category}/{group_id}/prices")
                r.raise_for_status()
                prices = r.json().get('results', [])
                if not prices:
                    file.write(f"No prices found for group {group_id}\n")
                
                #for price in prices:
                    #file.write(f"{price['productId']} - {price['subTypeName']} - {price['marketPrice']}\n")
            
            except Exception as e:
                file.write(f"Failed to fetch prices for group {group_id}: {e}\n")
            
            for p in prices:
               product_id = p["productId"]
               names=name_lookup.get(product_id, 'Unknown')
               urls=img_lookup.get(product_id, 'Unknown')
               name_str = ", ".join(names)
               imageUrl = ", ".join(urls)
               file.write(f"{name_str}|{p['subTypeName']}|{p['marketPrice']}|{imageUrl}|{product_id}\n")
    
    except requests.exceptions.RequestException as e:
        file.write(f"An error occurred: {e}\n")

