async function me(req, res) {
    res.json({
        status: "OK",
        user: { id: String(req.user._id), username: req.user.username, role: req.user.role },
    });
}

module.exports = { me };
