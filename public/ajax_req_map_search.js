$(document).ready(function())
{
    function StoresSearch()
    {
        $.ajax(
            {
                type:"GET",
                url:"/users/map/search",
                success:function(result)
                {
                    
                }
            }
        )
    }
}