/**
 * @description Demonstrates how to make REST calls to ConnectApi.CommerceSearch class
 * to perform Search and Category browsing for B2B Commerce on Lightning.
 *
 * @see B2BUtils
 */
public with sharing class B2BSearchController {
    // Cached API version of this apex class.
    private static Decimal apiVersionApexClass = [
        // SELECT ApiVersion
        // FROM ApexClass
        // WHERE Name = 'B2BSearchController'
        // WITH SECURITY_ENFORCED
        // LIMIT 1

        // The above query fails when using SECURITY_ENFORCEMENT, we may need to adjust this at a later date
        SELECT ApiVersion
        FROM ApexClass
        WHERE Name = 'B2BSearchController'
        LIMIT 1
    ]
    .ApiVersion;

    /**
     * @description Demonstrates how to call ConnectApi.CommerceSearch.productSearch
     * @param communityId The Id of the community from which the call originated
     * @param searchQuery The search query parameters which includes searchTerm, categoryId, refinements, page and includePrices
     * @param @param effectiveAccountId ID of the account for which the request is made. If null, defaults to the account ID for the context user.
     */
    @AuraEnabled(cacheable=false)
    public static Object productSearch(
        String communityId,
        String searchQuery,
        String effectiveAccountId
    ) {
        // Lookup the webstore ID associated with the community
        String webstoreId = B2BUtils.resolveCommunityIdToWebstoreId(
            communityId
        );

        ConnectApi.ProductSearchInput psi = (ConnectApi.ProductSearchInput)JSON.deserialize(searchQuery, ConnectApi.ProductSearchInput.class);

        return ConnectApi.CommerceSearch.searchProducts(
            webstoreId,
            effectiveAccountId,
            psi
        );
    }
}