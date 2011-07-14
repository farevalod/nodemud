function mychar(id, hp) {
	this.id = id;
	this.hp = hp;

	function hit(hits) {
		this.hp -= hits;
	}
}
