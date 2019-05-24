export default {
  parseUrl: function(id) {
    return (
      decodeURIComponent(
        (new RegExp("[?|&]" + id + "=" + "([^&;]+?)(&|#|;|$)").exec(
          location.href
        ) || [, ""])[1].replace(/\+/g, "%20")
      ) || null
    );
  }
};
