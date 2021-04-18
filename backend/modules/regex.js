exports.nom = /^[-a-zA-ZœçàâäéèêëîïôöùûüŷÿŒÇÀÂÄÉÈÊËÎÏÔÖÙÛÜŶŸ\s]{1,64}$/;
exports.email = /^[-._a-zA-Z0-9]+@[-._a-zA-Z0-9]+\.[a-zA-Z]{2,5}$/;
exports.mdp = /^.{8,64}$/;

exports.bbcode = (texte) => {
    return texte
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\[(\/?(b|i|u|s|sub|sup))\]/gi, '<$1>')
    .replace(/((https?|ftp|ssh):\/\/[a-z0-9\/:%_+.,#?!@&=-]+)/g, '<a href="$1" target="_blank">$1</a>')
    .replace(/\n/g, '<br />');
};
