const recipes = document.querySelector('.cards');
const form = document.querySelector('.newform');

// db.collection('recipes').get().then((response) => {
// 	addRecipe(response.docs);
// 	deleteRecipe()
// }).catch( error => {
// 	console.log(error)
// });

db.collection('recipes').onSnapshot( snapshot => {
	// console.log(snapshot);
	snapshot.docChanges().forEach(change => {
		console.log(change);
		if(change.type === "added"){
			addRecipe(change);
			deleteRecipe();
		} else if(change.type === "removed"){
			deleteRecipe(change.id)
		}
	})
});

const addRecipe = (recipe) => {
	var html, title, author, time, id;
	recipe = recipe.doc;

	html = '';
	id = recipe.id;
	title = recipe._document.proto ? recipe._document.proto.fields.title.stringValue : recipe._document.objectValue.internalValue.root.right.value.internalValue;
	body = recipe._document.proto ? recipe._document.proto.fields.body.stringValue : recipe._document.objectValue.internalValue.root.value.internalValue;
	author = recipe._document.proto ? recipe._document.proto.fields.author.stringValue : recipe._document.objectValue.internalValue.root.left.value.internalValue;
	// time = recipe._document.proto && recipe._document.proto.fields.time.timestampValue ? new Date(recipe._document.proto.fields.time.timestampValue).toDateString() : new Date(recipe._document.proto.fields.time.stringValue).toDateString();
	time = '';

	html += `<div class="col-sm-12 col-md-6 col-lg-4 mb-3">
				<div class="card" data-id="${id}" style="width: 100%;min-height: 100%;">
					<div class="card-body">
						<h5 class="card-title">${title}</h5>
						<p class="card-text">${body}</p>
						<button type="button" class="btn btn-danger delete">Delete</button>
					</div>
					<div class="card-footer">
						<small class="text-muted">By <b>${author}</b><b>${time}</b></small>
					</div>
				</div>
			</div>`;
	recipes.innerHTML += html;
};

const deleteRecipe = (id) => {
	if(id){
		console.log(id)
		db.collection('recipes').doc(id).delete().then((response) => {
			console.log('Succesfull deleted');
			document.querySelector('[data-id="'+ id +'"]').remove();
		}).catch( error => {
			console.log(error)
		});
	}else{
		var deleteBtn = document.querySelectorAll('.delete');
		deleteBtn.forEach( button => {
			button.addEventListener('click', e => {
				db.collection('recipes').doc(e.path[2].getAttribute('data-id')).delete().then((response) => {
					console.log('Succesfull deleted');
					e.path[3].remove();
				}).catch( error => {
					console.log(error)
				});
			});
		});
	}
};

form.addEventListener('submit', e => {
	e.preventDefault();
	var newrecipe = {
		title: document.querySelector('#title').value,
		author: document.querySelector('#name').value,
		body: document.querySelector('#body').value,
		time: new Date().toISOString()
	};

	// console.log(newrecipe)
	var successmsg = '<div class="alert alert-success" role="alert">Your recipe successful added! Thank you '+ document.querySelector('#name').value +' for your attension</div>';
	db.collection('recipes').add(newrecipe).then((response) => {
		if(!form.classList.contains('not')){
			form.append(htmlToElement(successmsg))
			form.classList.add('not')
		}

	}).catch( error => {
		console.log(error)
	});
});


const htmlToElement = (html) => {
	var template = document.createElement('template');
	html = html.trim(); // Never return a text node of whitespace as the result
	template.innerHTML = html;
	return template.content.firstChild;
};

