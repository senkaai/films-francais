$(document).ready(function () {
    function loadMovies(templateSelector) {
        const goodNote = $('#goodNote').val();
        const badNote = $('#badNote').val();
        const origineFilm = $('#FiltrePays').val();

        $('#goodNote').parent().hide();
        $('#badNote').parent().hide();
        $('#movies-container').empty();

        let url = 'http://localhost:3000/movies?';
        if (origineFilm && origineFilm !== "TOUS") {
            url += `origine=${origineFilm}&`;
        }
        if (templateSelector === 'banger') {
            url += `niveau=Classic&minNote=${goodNote}&`;
        } else if (templateSelector === 'navet') {
            url += `niveau=Navet&maxNote=${badNote}&`;
        } else if (templateSelector === 'all') {
            url += `minNote=${goodNote}&maxNote=${badNote}&`;
        }

        $.ajax({
            url: url,
            dataType: 'json',
            success: function (moviesData) {
                const container = $('#movies-container');

                $.each(moviesData, function (i, movie) {
                    let templateId;

                    if (templateSelector == 'banger' && movie.note >= goodNote) {
                        templateId = 'banger';
                    } else if (templateSelector == 'navet' && movie.note <= badNote) {
                        templateId = 'navets';
                    } else if (templateSelector == 'all') {
                        if (movie.note >= goodNote) {
                            templateId = 'banger';
                        } else if (movie.note <= badNote) {
                            templateId = 'navets';
                        } else {
                            templateId = 'movie-template';
                        }
                    }

                    if (templateId) {
                        const template = document.getElementById(templateId);
                        const instance = document.importNode(template.content, true);

                        $(instance).find('.nom').text(movie.nom);
                        $(instance).find('.dateDeSortie').text(movie.dateDeSortie);
                        $(instance).find('.realisateur').text(movie.realisateur);
                        $(instance).find('.note').text(movie.note);
                        $(instance).find('.notePublic').text(movie.notePublic || 'N/A');
                        $(instance).find('.compagnie').text(movie.compagnie);
                        $(instance).find('.description').text(movie.description);
                        $(instance).find('.lienImage').attr('src', movie.lienImage);

                        if (movie.notePublic > 0) {
                            const criticNote = movie.note;
                            const publicNote = movie.notePublic || 0;
                            const difference = Math.abs(criticNote - publicNote).toFixed(1);
                            $(instance).find('.noteDifference').text(difference);
                        } else {
                            $(instance).find('.noteDifference').text('Note public indisponible');
                        }

                        $(instance).find('.delete-button').attr('data-id', movie.id);

                        container.append(instance);
                    }
                });

                $('.delete-button').on('click', function () {
                    const movieId = $(this).attr('data-id');
                    $.ajax({
                        url: `http://localhost:3000/movies/${movieId}`,
                        type: 'DELETE',
                        success: function (result) {
                            alert('Film supprimé avec succès');
                            loadMovies(templateSelector);
                        },
                        error: function (xhr, status, error) {
                            console.error("Erreur " + error);
                        }
                    });
                });
            },
            error: function (xhr, status, error) {
                console.error("Erreur " + error);
            }
        });
    }

    $('#loadMoviesButton').on('click', function () {
        $(this).hide();
        loadMovies('all');
    });

    $('#importBanger').on('click', function () {
        $(this).hide();
        loadMovies('banger');
    });

    $('#importNavets').on('click', function () {
        $(this).hide();
        loadMovies('navet');
    });

    $('#clearButton').on('click', function () {
        $('#loadMoviesButton').show();
        $('#importBanger').show();
        $('#importNavets').show();
        $('#goodNote').parent().show();
        $('#badNote').parent().show();
        $('#FiltrePays').val("");
        $('#movies-container').empty();
    });

    $('#addMovieForm').on('submit', function (e) {
        e.preventDefault();

        const newMovie = {
            nom: $('#nom').val(),
            dateDeSortie: $('#dateDeSortie').val(),
            realisateur: $('#realisateur').val(),
            notePublic: $('#notePublic').val(),
            note: $('#note').val(),
            compagnie: $('#compagnie').val(),
            description: $('#description').val(),
            origine: $('#origine').val(),
            lienImage: $('#lienImage').val()
        };

        $.ajax({
            url: 'http://localhost:3000/movies',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newMovie),
            success: function (result) {
                alert('Film ajouté avec succès');
                $('#addMovieForm')[0].reset();
                loadMovies('all');
            },
            error: function (xhr, status, error) {
                console.error("Erreur " + error);
            }
        });
    });
});