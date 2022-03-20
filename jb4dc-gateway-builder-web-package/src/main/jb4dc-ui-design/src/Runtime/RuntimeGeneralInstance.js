let RuntimeGeneralInstance = {
    TryGetMenuOuterId: function () {
        return BaseUtility.GetUrlParaValue("menuOuterId");
    }
}

export {RuntimeGeneralInstance as default};