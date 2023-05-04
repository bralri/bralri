---
layout: 'layouts/work-post-alt.njk'
title: "Thingamajig"
type: "BlogPosting"
priority: "0.5"
date: 2020-04-21
year: "2020"
description: "page description"
thumbnail: "/assets/img/works/thingamajig/post-thumbnail.webp"

gallery:
  - url: "/assets/img/works/thingamajig/thingamajig.webp"
    title: "Thingamajig"
    alt: "Digital collage"
---

<figure class="main-article__figure">
    <img src="{{ gallery[0].url  }}" alt="{{ gallery[0].alt }}" title="{{ gallery[0].title }}">
        <figcaption>
            "{{ gallery[0].title }}". {{ gallery[0].alt }}.
        </figcaption>
</figure>