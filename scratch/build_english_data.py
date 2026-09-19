# Build english-data.js for Moge English Copybook Generator
import json

# Curated phonetics and breakdowns
words_data = {
    # Animals
    "cat": {"p": "/kæt/", "parts": [["cat", "root"]]},
    "dog": {"p": "/dɒɡ/", "parts": [["dog", "root"]]},
    "bird": {"p": "/bɜːd/", "parts": [["bird", "root"]]},
    "fish": {"p": "/fɪʃ/", "parts": [["fish", "root"]]},
    "duck": {"p": "/dʌk/", "parts": [["duck", "root"]]},
    "bear": {"p": "/beə/", "parts": [["bear", "root"]]},
    "tiger": {"p": "/ˈtaɪɡə/", "parts": [["tiger", "root"]]},
    "lion": {"p": "/ˈlaɪən/", "parts": [["lion", "root"]]},
    "elephant": {"p": "/ˈelɪfənt/", "parts": [["elephant", "root"]]},
    "monkey": {"p": "/ˈmʌŋki/", "parts": [["monkey", "root"]]},
    "panda": {"p": "/ˈpændə/", "parts": [["panda", "root"]]},
    "rabbit": {"p": "/ˈræbɪt/", "parts": [["rabbit", "root"]]},
    "horse": {"p": "/hɔːs/", "parts": [["horse", "root"]]},
    "sheep": {"p": "/ʃiːp/", "parts": [["sheep", "root"]]},
    "pig": {"p": "/pɪɡ/", "parts": [["pig", "root"]]},
    "cow": {"p": "/kaʊ/", "parts": [["cow", "root"]]},
    "mouse": {"p": "/maʊs/", "parts": [["mouse", "root"]]},

    # Food & Drink
    "apple": {"p": "/ˈæpl/", "parts": [["apple", "root"]]},
    "banana": {"p": "/bəˈnɑːnə/", "parts": [["banana", "root"]]},
    "orange": {"p": "/ˈɒrɪndʒ/", "parts": [["orange", "root"]]},
    "grape": {"p": "/ɡreɪp/", "parts": [["grape", "root"]]},
    "water": {"p": "/ˈwɔːtə/", "parts": [["water", "root"]]},
    "milk": {"p": "/mɪlk/", "parts": [["milk", "root"]]},
    "bread": {"p": "/bred/", "parts": [["bread", "root"]]},
    "rice": {"p": "/raɪs/", "parts": [["rice", "root"]]},
    "tea": {"p": "/tiː/", "parts": [["tea", "root"]]},
    "juice": {"p": "/dʒuːs/", "parts": [["juice", "root"]]},
    "cake": {"p": "/keɪk/", "parts": [["cake", "root"]]},
    "candy": {"p": "/ˈkændi/", "parts": [["candy", "root"]]},
    "coffee": {"p": "/ˈkɒfi/", "parts": [["coffee", "root"]]},
    "egg": {"p": "/eɡ/", "parts": [["egg", "root"]]},
    "fruit": {"p": "/fruːt/", "parts": [["fruit", "root"]]},

    # School & Study
    "book": {"p": "/bʊk/", "parts": [["book", "root"]]},
    "pen": {"p": "/pen/", "parts": [["pen", "root"]]},
    "pencil": {"p": "/ˈpensl/", "parts": [["pencil", "root"]]},
    "ruler": {"p": "/ˈruːlə/", "parts": [["rule", "root"], ["r", "suffix"]]},
    "eraser": {"p": "/ɪˈreɪzə/", "parts": [["erase", "root"], ["r", "suffix"]]},
    "school": {"p": "/skuːl/", "parts": [["school", "root"]]},
    "student": {"p": "/ˈstjuːdnt/", "parts": [["stud", "root"], ["ent", "suffix"]]},
    "teacher": {"p": "/ˈtiːtʃə/", "parts": [["teach", "root"], ["er", "suffix"]]},
    "classroom": {"p": "/ˈklɑːsruːm/", "parts": [["class", "compound"], ["room", "compound"]]},
    "desk": {"p": "/desk/", "parts": [["desk", "root"]]},
    "chair": {"p": "/tʃeə/", "parts": [["chair", "root"]]},
    "blackboard": {"p": "/ˈblækbɔːd/", "parts": [["black", "compound"], ["board", "compound"]]},
    "lesson": {"p": "/ˈlesn/", "parts": [["lesson", "root"]]},
    "homework": {"p": "/ˈhəʊmwɜːk/", "parts": [["home", "compound"], ["work", "compound"]]},
    "paper": {"p": "/ˈpeɪpə/", "parts": [["paper", "root"]]},

    # Family & People
    "family": {"p": "/ˈfæməli/", "parts": [["family", "root"]]},
    "father": {"p": "/ˈfɑːðə/", "parts": [["father", "root"]]},
    "mother": {"p": "/ˈmʌðə/", "parts": [["mother", "root"]]},
    "brother": {"p": "/ˈbrʌðə/", "parts": [["brother", "root"]]},
    "sister": {"p": "/ˈsɪstə/", "parts": [["sister", "root"]]},
    "parent": {"p": "/ˈpeərənt/", "parts": [["parent", "root"]]},
    "friend": {"p": "/frend/", "parts": [["friend", "root"]]},
    "friendship": {"p": "/ˈfrendʃɪp/", "parts": [["friend", "root"], ["ship", "suffix"]]},
    "friendly": {"p": "/ˈfrendli/", "parts": [["friend", "root"], ["ly", "suffix"]]},
    "unfriendly": {"p": "/ʌnˈfrendli/", "parts": [["un", "prefix"], ["friend", "root"], ["ly", "suffix"]]},
    "boy": {"p": "/bɔɪ/", "parts": [["boy", "root"]]},
    "girl": {"p": "/ɡɜːl/", "parts": [["girl", "root"]]},
    "child": {"p": "/tʃaɪld/", "parts": [["child", "root"]]},
    "children": {"p": "/ˈtʃɪldrən/", "parts": [["child", "root"], ["ren", "suffix"]]},
    "people": {"p": "/ˈpiːpl/", "parts": [["people", "root"]]},

    # Colors & Nature
    "red": {"p": "/red/", "parts": [["red", "root"]]},
    "blue": {"p": "/bluː/", "parts": [["blue", "root"]]},
    "green": {"p": "/ɡriːn/", "parts": [["green", "root"]]},
    "yellow": {"p": "/ˈjeləʊ/", "parts": [["yellow", "root"]]},
    "white": {"p": "/waɪt/", "parts": [["white", "root"]]},
    "black": {"p": "/blæk/", "parts": [["black", "root"]]},
    "sun": {"p": "/sʌn/", "parts": [["sun", "root"]]},
    "sunny": {"p": "/ˈsʌni/", "parts": [["sun", "root"], ["ny", "suffix"]]},
    "sunshine": {"p": "/ˈsʌnʃaɪn/", "parts": [["sun", "compound"], ["shine", "compound"]]},
    "moon": {"p": "/muːn/", "parts": [["moon", "root"]]},
    "star": {"p": "/stɑː/", "parts": [["star", "root"]]},
    "sky": {"p": "/skaɪ/", "parts": [["sky", "root"]]},
    "cloud": {"p": "/klaʊd/", "parts": [["cloud", "root"]]},
    "cloudy": {"p": "/ˈklaʊdi/", "parts": [["cloud", "root"], ["y", "suffix"]]},
    "rain": {"p": "/reɪn/", "parts": [["rain", "root"]]},
    "rainbow": {"p": "/ˈreɪnbəʊ/", "parts": [["rain", "compound"], ["bow", "compound"]]},
    "wind": {"p": "/wɪnd/", "parts": [["wind", "root"]]},
    "tree": {"p": "/triː/", "parts": [["tree", "root"]]},
    "flower": {"p": "/ˈflaʊə/", "parts": [["flower", "root"]]},

    # Classical Root: port (to carry 携带/运输)
    "port": {"p": "/pɔːt/", "parts": [["port", "root"]]},
    "portable": {"p": "/ˈpɔːtəbl/", "parts": [["port", "root"], ["able", "suffix"]]},
    "export": {"p": "/ɪkˈspɔːt/", "parts": [["ex", "prefix"], ["port", "root"]]},
    "import": {"p": "/ɪmˈpɔːt/", "parts": [["im", "prefix"], ["port", "root"]]},
    "transport": {"p": "/ˈtrænspɔːt/", "parts": [["trans", "prefix"], ["port", "root"]]},
    "transportation": {"p": "/ˌtrænspɔːˈteɪʃn/", "parts": [["trans", "prefix"], ["port", "root"], ["ation", "suffix"]]},
    "porter": {"p": "/ˈpɔːtə/", "parts": [["port", "root"], ["er", "suffix"]]},
    "passport": {"p": "/ˈpɑːspɔːt/", "parts": [["pass", "compound"], ["port", "compound"]]},
    "report": {"p": "/rɪˈpɔːt/", "parts": [["re", "prefix"], ["port", "root"]]},
    "reporter": {"p": "/rɪˈpɔːtə/", "parts": [["re", "prefix"], ["port", "root"], ["er", "suffix"]]},
    "support": {"p": "/səˈpɔːt/", "parts": [["sub", "prefix"], ["port", "root"]]},
    "important": {"p": "/ɪmˈpɔːtnt/", "parts": [["im", "prefix"], ["port", "root"], ["ant", "suffix"]]},
    "importance": {"p": "/ɪmˈpɔːtns/", "parts": [["im", "prefix"], ["port", "root"], ["ance", "suffix"]]},

    # Classical Root: dict (to speak/say 说/讲)
    "dict": {"p": "/dɪkt/", "parts": [["dict", "root"]]},
    "predict": {"p": "/prɪˈdɪkt/", "parts": [["pre", "prefix"], ["dict", "root"]]},
    "predictable": {"p": "/prɪˈdɪktəbl/", "parts": [["pre", "prefix"], ["dict", "root"], ["able", "suffix"]]},
    "unpredictable": {"p": "/ˌʌnprɪˈdɪktəbl/", "parts": [["un", "prefix"], ["pre", "prefix"], ["dict", "root"], ["able", "suffix"]]},
    "prediction": {"p": "/prɪˈdɪkʃn/", "parts": [["pre", "prefix"], ["dict", "root"], ["ion", "suffix"]]},
    "contradict": {"p": "/ˌkɒntrəˈdɪkt/", "parts": [["contra", "prefix"], ["dict", "root"]]},
    "dictate": {"p": "/dɪkˈteɪt/", "parts": [["dict", "root"], ["ate", "suffix"]]},
    "dictation": {"p": "/dɪkˈteɪʃn/", "parts": [["dict", "root"], ["ation", "suffix"]]},
    "dictionary": {"p": "/ˈdɪkʃənri/", "parts": [["dict", "root"], ["ion", "suffix"], ["ary", "suffix"]]},
    "verdict": {"p": "/ˈvɜːdɪkt/", "parts": [["ver", "prefix"], ["dict", "root"]]},

    # Classical Root: spect / spic (to look/see 看)
    "spectator": {"p": "/spekˈteɪtə/", "parts": [["spect", "root"], ["ator", "suffix"]]},
    "inspect": {"p": "/ɪnˈspekt/", "parts": [["in", "prefix"], ["spect", "root"]]},
    "inspection": {"p": "/ɪnˈspekʃn/", "parts": [["in", "prefix"], ["spect", "root"], ["ion", "suffix"]]},
    "inspector": {"p": "/ɪnˈspektə/", "parts": [["in", "prefix"], ["spect", "root"], ["or", "suffix"]]},
    "respect": {"p": "/rɪˈspekt/", "parts": [["re", "prefix"], ["spect", "root"]]},
    "respectful": {"p": "/rɪˈspektfl/", "parts": [["re", "prefix"], ["spect", "root"], ["ful", "suffix"]]},
    "perspective": {"p": "/pəˈspektɪv/", "parts": [["per", "prefix"], ["spect", "root"], ["ive", "suffix"]]},
    "prospect": {"p": "/ˈprɒspekt/", "parts": [["pro", "prefix"], ["spect", "root"]]},
    "retrospect": {"p": "/ˈretrəspekt/", "parts": [["retro", "prefix"], ["spect", "root"]]},
    "suspect": {"p": "/səˈspekt/", "parts": [["sub", "prefix"], ["spect", "root"]]},

    # Classical Root: struct (to build 构建)
    "structure": {"p": "/ˈstrʌktʃə/", "parts": [["struct", "root"], ["ure", "suffix"]]},
    "construct": {"p": "/kənˈstrʌkt/", "parts": [["con", "prefix"], ["struct", "root"]]},
    "construction": {"p": "/kənˈstrʌkʃn/", "parts": [["con", "prefix"], ["struct", "root"], ["ion", "suffix"]]},
    "reconstruct": {"p": "/ˌriːkənˈstrʌkt/", "parts": [["re", "prefix"], ["con", "prefix"], ["struct", "root"]]},
    "destruct": {"p": "/dɪˈstrʌkt/", "parts": [["de", "prefix"], ["struct", "root"]]},
    "destruction": {"p": "/dɪˈstrʌkʃn/", "parts": [["de", "prefix"], ["struct", "root"], ["ion", "suffix"]]},
    "instruct": {"p": "/ɪnˈstrʌkt/", "parts": [["in", "prefix"], ["struct", "root"]]},
    "instructor": {"p": "/ɪnˈstrʌktə/", "parts": [["in", "prefix"], ["struct", "root"], ["or", "suffix"]]},
    "instruction": {"p": "/ɪnˈstrʌkʃn/", "parts": [["in", "prefix"], ["struct", "root"], ["ion", "suffix"]]},
    "obstruct": {"p": "/əbˈstrʌkt/", "parts": [["ob", "prefix"], ["struct", "root"]]},

    # Classical Root: vis / vid (to see 看)
    "visible": {"p": "/ˈvɪzəbl/", "parts": [["vis", "root"], ["ible", "suffix"]]},
    "invisible": {"p": "/ɪnˈvɪzəbl/", "parts": [["in", "prefix"], ["vis", "root"], ["ible", "suffix"]]},
    "vision": {"p": "/ˈvɪʒn/", "parts": [["vis", "root"], ["ion", "suffix"]]},
    "visual": {"p": "/ˈvɪʒuəl/", "parts": [["vis", "root"], ["ual", "suffix"]]},
    "visit": {"p": "/ˈvɪzɪt/", "parts": [["vis", "root"], ["it", "suffix"]]},
    "visitor": {"p": "/ˈvɪzɪtə/", "parts": [["vis", "root"], ["it", "suffix"], ["or", "suffix"]]},
    "supervise": {"p": "/ˈsuːpəvaɪz/", "parts": [["super", "prefix"], ["vis", "root"], ["e", "suffix"]]},
    "supervisor": {"p": "/ˈsuːpəvaɪzə/", "parts": [["super", "prefix"], ["vis", "root"], ["or", "suffix"]]},
    "revise": {"p": "/rɪˈvaɪz/", "parts": [["re", "prefix"], ["vis", "root"], ["e", "suffix"]]},
    "revision": {"p": "/rɪˈvɪʒn/", "parts": [["re", "prefix"], ["vis", "root"], ["ion", "suffix"]]},
    "evident": {"p": "/ˈevɪdənt/", "parts": [["ex", "prefix"], ["vid", "root"], ["ent", "suffix"]]},
    "evidence": {"p": "/ˈevɪdəns/", "parts": [["ex", "prefix"], ["vid", "root"], ["ence", "suffix"]]},

    # Classical Root: tract (to draw/pull 拉/拽)
    "attract": {"p": "/əˈtrækt/", "parts": [["ad", "prefix"], ["tract", "root"]]},
    "attractive": {"p": "/əˈtræktɪv/", "parts": [["ad", "prefix"], ["tract", "root"], ["ive", "suffix"]]},
    "attraction": {"p": "/əˈtrækʃn/", "parts": [["ad", "prefix"], ["tract", "root"], ["ion", "suffix"]]},
    "contract": {"p": "/ˈkɒntrækt/", "parts": [["con", "prefix"], ["tract", "root"]]},
    "distract": {"p": "/dɪˈstrækt/", "parts": [["dis", "prefix"], ["tract", "root"]]},
    "extract": {"p": "/ɪkˈstrækt/", "parts": [["ex", "prefix"], ["tract", "root"]]},
    "subtract": {"p": "/səbˈtrækt/", "parts": [["sub", "prefix"], ["tract", "root"]]},
    "tractor": {"p": "/ˈtræktə/", "parts": [["tract", "root"], ["or", "suffix"]]},

    # Classical Root: form (shape/mold 形式/形成)
    "form": {"p": "/fɔːm/", "parts": [["form", "root"]]},
    "inform": {"p": "/ɪnˈfɔːm/", "parts": [["in", "prefix"], ["form", "root"]]},
    "information": {"p": "/ˌɪnfəˈmeɪʃn/", "parts": [["in", "prefix"], ["form", "root"], ["ation", "suffix"]]},
    "reform": {"p": "/rɪˈfɔːm/", "parts": [["re", "prefix"], ["form", "root"]]},
    "transform": {"p": "/trænsˈfɔːm/", "parts": [["trans", "prefix"], ["form", "root"]]},
    "transformation": {"p": "/ˌtrænsfəˈmeɪʃn/", "parts": [["trans", "prefix"], ["form", "root"], ["ation", "suffix"]]},
    "conform": {"p": "/kənˈfɔːm/", "parts": [["con", "prefix"], ["form", "root"]]},
    "perform": {"p": "/pəˈfɔːm/", "parts": [["per", "prefix"], ["form", "root"]]},
    "performance": {"p": "/pəˈfɔːməns/", "parts": [["per", "prefix"], ["form", "root"], ["ance", "suffix"]]},
    "uniform": {"p": "/ˈjuːnɪfɔːm/", "parts": [["uni", "prefix"], ["form", "root"]]},

    # Classical Root: act (to do 做/行动)
    "act": {"p": "/ækt/", "parts": [["act", "root"]]},
    "action": {"p": "/ˈækʃn/", "parts": [["act", "root"], ["ion", "suffix"]]},
    "active": {"p": "/ˈæktɪv/", "parts": [["act", "root"], ["ive", "suffix"]]},
    "activity": {"p": "/ækˈtɪvəti/", "parts": [["act", "root"], ["iv", "suffix"], ["ity", "suffix"]]},
    "actor": {"p": "/ˈæktə/", "parts": [["act", "root"], ["or", "suffix"]]},
    "actress": {"p": "/ˈæktrəs/", "parts": [["act", "root"], ["ress", "suffix"]]},
    "react": {"p": "/riˈækt/", "parts": [["re", "prefix"], ["act", "root"]]},
    "reaction": {"p": "/riˈækʃn/", "parts": [["re", "prefix"], ["act", "root"], ["ion", "suffix"]]},
    "interact": {"p": "/ˌɪntərˈækt/", "parts": [["inter", "prefix"], ["act", "root"]]},
    "interaction": {"p": "/ˌɪntərˈækʃn/", "parts": [["inter", "prefix"], ["act", "root"], ["ion", "suffix"]]},
    "exact": {"p": "/ɪɡˈzækt/", "parts": [["ex", "prefix"], ["act", "root"]]},

    # Classical Root: scrib / script (to write 写)
    "describe": {"p": "/dɪˈskraɪb/", "parts": [["de", "prefix"], ["scrib", "root"], ["e", "suffix"]]},
    "description": {"p": "/dɪˈskrɪpʃn/", "parts": [["de", "prefix"], ["script", "root"], ["ion", "suffix"]]},
    "subscribe": {"p": "/səbˈskraɪb/", "parts": [["sub", "prefix"], ["scrib", "root"], ["e", "suffix"]]},
    "manuscript": {"p": "/ˈmænjuskrɪpt/", "parts": [["manu", "prefix"], ["script", "root"]]},
    "script": {"p": "/skrɪpt/", "parts": [["script", "root"]]},

    # Classical Root: bio / geo / phon / log / graph (生命/地理/声音/学科/写)
    "biology": {"p": "/baɪˈɒlədʒi/", "parts": [["bio", "prefix"], ["log", "root"], ["y", "suffix"]]},
    "geography": {"p": "/dʒiˈɒɡrəfi/", "parts": [["geo", "prefix"], ["graph", "root"], ["y", "suffix"]]},
    "photograph": {"p": "/ˈfəʊtəɡrɑːf/", "parts": [["photo", "prefix"], ["graph", "root"]]},
    "photographer": {"p": "/fəˈtɒɡrəfə/", "parts": [["photo", "prefix"], ["graph", "root"], ["er", "suffix"]]},
    "telephone": {"p": "/ˈtelɪfəʊn/", "parts": [["tele", "prefix"], ["phone", "root"]]},
    "telescope": {"p": "/ˈtelɪskəʊp/", "parts": [["tele", "prefix"], ["scope", "root"]]},
    "microscope": {"p": "/ˈmaɪkrəskəʊp/", "parts": [["micro", "prefix"], ["scope", "root"]]},
    "dialogue": {"p": "/ˈdaɪəlɒɡ/", "parts": [["dia", "prefix"], ["log", "root"], ["ue", "suffix"]]},
    "autograph": {"p": "/ˈɔːtəɡrɑːf/", "parts": [["auto", "prefix"], ["graph", "root"]]},
    "automatic": {"p": "/ˌɔːtəˈmætɪk/", "parts": [["auto", "prefix"], ["mat", "root"], ["ic", "suffix"]]},

    # Common Affixes Examples
    "unhappy": {"p": "/ʌnˈhæpi/", "parts": [["un", "prefix"], ["happy", "root"]]},
    "unlucky": {"p": "/ʌnˈlʌki/", "parts": [["un", "prefix"], ["luck", "root"], ["y", "suffix"]]},
    "unfair": {"p": "/ˌʌnˈfeə/", "parts": [["un", "prefix"], ["fair", "root"]]},
    "unable": {"p": "/ʌnˈeɪbl/", "parts": [["un", "prefix"], ["able", "root"]]},
    "unknown": {"p": "/ˌʌnˈnəʊn/", "parts": [["un", "prefix"], ["know", "root"], ["n", "suffix"]]},
    "rewrite": {"p": "/ˌriːˈraɪt/", "parts": [["re", "prefix"], ["write", "root"]]},
    "rebuild": {"p": "/ˌriːˈbɪld/", "parts": [["re", "prefix"], ["build", "root"]]},
    "review": {"p": "/rɪˈvjuː/", "parts": [["re", "prefix"], ["view", "root"]]},
    "return": {"p": "/rɪˈtɜːn/", "parts": [["re", "prefix"], ["turn", "root"]]},
    "replay": {"p": "/ˌriːˈpleɪ/", "parts": [["re", "prefix"], ["play", "root"]]},
    "disagree": {"p": "/ˌdɪsəˈɡriː/", "parts": [["dis", "prefix"], ["agree", "root"]]},
    "disappear": {"p": "/ˌdɪsəˈpɪə/", "parts": [["dis", "prefix"], ["appear", "root"]]},
    "discover": {"p": "/dɪˈskʌvə/", "parts": [["dis", "prefix"], ["cover", "root"]]},
    "discovery": {"p": "/dɪˈskʌvəri/", "parts": [["dis", "prefix"], ["cover", "root"], ["y", "suffix"]]},
    "dishonest": {"p": "/dɪsˈɒnɪst/", "parts": [["dis", "prefix"], ["honest", "root"]]},
    "misunderstand": {"p": "/ˌmɪsʌndəˈstænd/", "parts": [["mis", "prefix"], ["under", "prefix"], ["stand", "root"]]},
    "mistake": {"p": "/mɪˈsteɪk/", "parts": [["mis", "prefix"], ["take", "root"]]},
    "impossible": {"p": "/ɪmˈpɒsəbl/", "parts": [["im", "prefix"], ["poss", "root"], ["ible", "suffix"]]},
    "impatient": {"p": "/ɪmˈpeɪʃnt/", "parts": [["im", "prefix"], ["patient", "root"]]},
    "international": {"p": "/ˌɪntəˈnæʃnəl/", "parts": [["inter", "prefix"], ["nation", "root"], ["al", "suffix"]]},
    "interview": {"p": "/ˈɪntəvjuː/", "parts": [["inter", "prefix"], ["view", "root"]]},
    "supermarket": {"p": "/ˈsuːpəmɑːkɪt/", "parts": [["super", "prefix"], ["market", "root"]]},
    "submarine": {"p": "/ˌsʌbməˈriːn/", "parts": [["sub", "prefix"], ["marine", "root"]]},
    "subway": {"p": "/ˈsʌbweɪ/", "parts": [["sub", "prefix"], ["way", "root"]]},

    # Suffixes
    "careful": {"p": "/ˈkeəfl/", "parts": [["care", "root"], ["ful", "suffix"]]},
    "carefully": {"p": "/ˈkeəfəli/", "parts": [["care", "root"], ["ful", "suffix"], ["ly", "suffix"]]},
    "careless": {"p": "/ˈkeələs/", "parts": [["care", "root"], ["less", "suffix"]]},
    "carelessness": {"p": "/ˈkeələsnəs/", "parts": [["care", "root"], ["less", "suffix"], ["ness", "suffix"]]},
    "hopeful": {"p": "/ˈhəʊpfl/", "parts": [["hope", "root"], ["ful", "suffix"]]},
    "hopeless": {"p": "/ˈhəʊpləs/", "parts": [["hope", "root"], ["less", "suffix"]]},
    "beautiful": {"p": "/ˈbjuːtɪfl/", "parts": [["beauti", "root"], ["ful", "suffix"]]},
    "beautifully": {"p": "/ˈbjuːtɪfli/", "parts": [["beauti", "root"], ["ful", "suffix"], ["ly", "suffix"]]},
    "happiness": {"p": "/ˈhæpinəs/", "parts": [["happi", "root"], ["ness", "suffix"]]},
    "darkness": {"p": "/ˈdɑːknəs/", "parts": [["dark", "root"], ["ness", "suffix"]]},
    "kindness": {"p": "/ˈkaɪndnəs/", "parts": [["kind", "root"], ["ness", "suffix"]]},
    "illness": {"p": "/ˈɪlnəs/", "parts": [["ill", "root"], ["ness", "suffix"]]},
    "sadness": {"p": "/ˈsædnəs/", "parts": [["sad", "root"], ["ness", "suffix"]]},
    "weakness": {"p": "/ˈwiːknəs/", "parts": [["weak", "root"], ["ness", "suffix"]]},
    "goodness": {"p": "/ˈɡʊdnəs/", "parts": [["good", "root"], ["ness", "suffix"]]},
    "development": {"p": "/dɪˈveləpmənt/", "parts": [["develop", "root"], ["ment", "suffix"]]},
    "agreement": {"p": "/əˈɡriːmənt/", "parts": [["agree", "root"], ["ment", "suffix"]]},
    "disagreement": {"p": "/ˌdɪsəˈɡriːmənt/", "parts": [["dis", "prefix"], ["agree", "root"], ["ment", "suffix"]]},
    "movement": {"p": "/ˈmuːvmənt/", "parts": [["move", "root"], ["ment", "suffix"]]},
    "government": {"p": "/ˈɡʌvənmənt/", "parts": [["govern", "root"], ["ment", "suffix"]]},
    "improvement": {"p": "/ɪmˈpruːvmənt/", "parts": [["improve", "root"], ["ment", "suffix"]]},
    "treatment": {"p": "/ˈtriːtmənt/", "parts": [["treat", "root"], ["ment", "suffix"]]},
    "leader": {"p": "/ˈliːdə/", "parts": [["lead", "root"], ["er", "suffix"]]},
    "player": {"p": "/ˈpleɪə/", "parts": [["play", "root"], ["er", "suffix"]]},
    "worker": {"p": "/ˈwɜːkə/", "parts": [["work", "root"], ["er", "suffix"]]},
    "farmer": {"p": "/ˈfɑːmə/", "parts": [["farm", "root"], ["er", "suffix"]]},
    "singer": {"p": "/ˈsɪŋə/", "parts": [["sing", "root"], ["er", "suffix"]]},
    "writer": {"p": "/ˈraɪtə/", "parts": [["write", "root"], ["er", "suffix"]]},
    "runner": {"p": "/ˈrʌnə/", "parts": [["run", "root"], ["er", "suffix"]]},
    "swimmer": {"p": "/ˈswɪmə/", "parts": [["swim", "root"], ["er", "suffix"]]},
    "doctor": {"p": "/ˈdɒktə/", "parts": [["doc", "root"], ["tor", "suffix"]]},
    "visitor": {"p": "/ˈvɪzɪtə/", "parts": [["visit", "root"], ["or", "suffix"]]},
    "scientist": {"p": "/ˈsaɪəntɪst/", "parts": [["scient", "root"], ["ist", "suffix"]]},
    "artist": {"p": "/ˈɑːtɪst/", "parts": [["art", "root"], ["ist", "suffix"]]},
    "pianist": {"p": "/ˈpɪənɪst/", "parts": [["piano", "root"], ["ist", "suffix"]]},
    "tourist": {"p": "/ˈtʊərɪst/", "parts": [["tour", "root"], ["ist", "suffix"]]},

    # Compound Words
    "football": {"p": "/ˈfʊtbɔːl/", "parts": [["foot", "compound"], ["ball", "compound"]]},
    "basketball": {"p": "/ˈbɑːskɪtbɔːl/", "parts": [["basket", "compound"], ["ball", "compound"]]},
    "pancake": {"p": "/ˈpænkeɪk/", "parts": [["pan", "compound"], ["cake", "compound"]]},
    "cupcake": {"p": "/ˈkʌpkeɪk/", "parts": [["cup", "compound"], ["cake", "compound"]]},
    "seafood": {"p": "/ˈsiːfuːd/", "parts": [["sea", "compound"], ["food", "compound"]]},
    "butterfly": {"p": "/ˈbʌtəflaɪ/", "parts": [["butter", "compound"], ["fly", "compound"]]},
    "firefly": {"p": "/ˈfaɪəflaɪ/", "parts": [["fire", "compound"], ["fly", "compound"]]},
    "playground": {"p": "/ˈpleɪɡraʊnd/", "parts": [["play", "compound"], ["ground", "compound"]]},
    "bedroom": {"p": "/ˈbedruːm/", "parts": [["bed", "compound"], ["room", "compound"]]},
    "bathroom": {"p": "/ˈbɑːθruːm/", "parts": [["bath", "compound"], ["room", "compound"]]},
    "livingroom": {"p": "/ˈlɪvɪŋruːm/", "parts": [["living", "compound"], ["room", "compound"]]},
    "bookstore": {"p": "/ˈbʊkstɔː/", "parts": [["book", "compound"], ["store", "compound"]]},
    "postman": {"p": "/ˈpəʊstmən/", "parts": [["post", "compound"], ["man", "compound"]]},
    "sunflower": {"p": "/ˈsʌnflaʊə/", "parts": [["sun", "compound"], ["flower", "compound"]]},
    "watermelon": {"p": "/ˈwɔːtəmelən/", "parts": [["water", "compound"], ["melon", "compound"]]},
    "strawberry": {"p": "/ˈstrɔːbəri/", "parts": [["straw", "compound"], ["berry", "compound"]]},
    "everyday": {"p": "/ˈevrideɪ/", "parts": [["every", "compound"], ["day", "compound"]]},
    "everybody": {"p": "/ˈevribɒdi/", "parts": [["every", "compound"], ["body", "compound"]]},
    "everyone": {"p": "/ˈevriwʌn/", "parts": [["every", "compound"], ["one", "compound"]]},
    "everything": {"p": "/ˈevriθɪŋ/", "parts": [["every", "compound"], ["thing", "compound"]]},
    "somewhere": {"p": "/ˈsʌmweə/", "parts": [["some", "compound"], ["where", "compound"]]},
    "anywhere": {"p": "/ˈeniweə/", "parts": [["any", "compound"], ["where", "compound"]]},
    "nowhere": {"p": "/ˈnəʊweə/", "parts": [["no", "compound"], ["where", "compound"]]},
    "without": {"p": "/wɪˈðaʊt/", "parts": [["with", "compound"], ["out", "compound"]]},
    "within": {"p": "/wɪˈðɪn/", "parts": [["with", "compound"], ["in", "compound"]]},
    "inside": {"p": "/ˌɪnˈsaɪd/", "parts": [["in", "compound"], ["side", "compound"]]},
    "outside": {"p": "/ˌaʊtˈsaɪd/", "parts": [["out", "compound"], ["side", "compound"]]},

    # More Core High Frequency Vocabulary
    "time": {"p": "/taɪm/", "parts": [["time", "root"]]},
    "year": {"p": "/jɪə/", "parts": [["year", "root"]]},
    "day": {"p": "/deɪ/", "parts": [["day", "root"]]},
    "today": {"p": "/təˈdeɪ/", "parts": [["to", "prefix"], ["day", "root"]]},
    "tomorrow": {"p": "/təˈmɒrəʊ/", "parts": [["to", "prefix"], ["morrow", "root"]]},
    "yesterday": {"p": "/ˈjestədeɪ/", "parts": [["yester", "prefix"], ["day", "root"]]},
    "morning": {"p": "/ˈmɔːnɪŋ/", "parts": [["morn", "root"], ["ing", "suffix"]]},
    "afternoon": {"p": "/ˌɑːftəˈnuːn/", "parts": [["after", "compound"], ["noon", "compound"]]},
    "evening": {"p": "/ˈiːvnɪŋ/", "parts": [["even", "root"], ["ing", "suffix"]]},
    "night": {"p": "/naɪt/", "parts": [["night", "root"]]},
    "week": {"p": "/wiːk/", "parts": [["week", "root"]]},
    "weekend": {"p": "/ˌwiːkˈend/", "parts": [["week", "compound"], ["end", "compound"]]},
    "month": {"p": "/mʌnθ/", "parts": [["month", "root"]]},
    "spring": {"p": "/sprɪŋ/", "parts": [["spring", "root"]]},
    "summer": {"p": "/ˈsʌmə/", "parts": [["summer", "root"]]},
    "autumn": {"p": "/ˈɔːtəm/", "parts": [["autumn", "root"]]},
    "winter": {"p": "/ˈwɪntə/", "parts": [["winter", "root"]]},
    "world": {"p": "/wɜːld/", "parts": [["world", "root"]]},
    "earth": {"p": "/ɜːθ/", "parts": [["earth", "root"]]},
    "country": {"p": "/ˈkʌntri/", "parts": [["country", "root"]]},
    "city": {"p": "/ˈsɪti/", "parts": [["city", "root"]]},
    "town": {"p": "/taʊn/", "parts": [["town", "root"]]},
    "village": {"p": "/ˈvɪlɪdʒ/", "parts": [["village", "root"]]},
    "house": {"p": "/haʊs/", "parts": [["house", "root"]]},
    "door": {"p": "/dɔː/", "parts": [["door", "root"]]},
    "window": {"p": "/ˈwɪndəʊ/", "parts": [["window", "root"]]},
    "road": {"p": "/rəʊd/", "parts": [["road", "root"]]},
    "street": {"p": "/striːt/", "parts": [["street", "root"]]},
    "car": {"p": "/kɑː/", "parts": [["car", "root"]]},
    "bus": {"p": "/bʌs/", "parts": [["bus", "root"]]},
    "train": {"p": "/treɪn/", "parts": [["train", "root"]]},
    "plane": {"p": "/pleɪn/", "parts": [["plane", "root"]]},
    "airplane": {"p": "/ˈeəpleɪn/", "parts": [["air", "compound"], ["plane", "compound"]]},
    "bike": {"p": "/baɪk/", "parts": [["bike", "root"]]},
    "bicycle": {"p": "/ˈbaɪsɪkl/", "parts": [["bi", "prefix"], ["cycl", "root"], ["e", "suffix"]]},
    "love": {"p": "/lʌv/", "parts": [["love", "root"]]},
    "lovely": {"p": "/ˈlʌvli/", "parts": [["love", "root"], ["ly", "suffix"]]},
    "hope": {"p": "/həʊp/", "parts": [["hope", "root"]]},
    "dream": {"p": "/driːm/", "parts": [["dream", "root"]]},
    "peace": {"p": "/piːs/", "parts": [["peace", "root"]]},
    "peaceful": {"p": "/ˈpiːsfl/", "parts": [["peace", "root"], ["ful", "suffix"]]},
    "smile": {"p": "/smaɪl/", "parts": [["smile", "root"]]},
    "laugh": {"p": "/lɑːf/", "parts": [["laugh", "root"]]},
    "happy": {"p": "/ˈhæpi/", "parts": [["happy", "root"]]},
    "warm": {"p": "/wɔːm/", "parts": [["warm", "root"]]},
    "warmth": {"p": "/wɔːmθ/", "parts": [["warm", "root"], ["th", "suffix"]]},
    "bright": {"p": "/braɪt/", "parts": [["bright", "root"]]},
    "brightly": {"p": "/ˈbraɪtli/", "parts": [["bright", "root"], ["ly", "suffix"]]},
    "clever": {"p": "/ˈklevə/", "parts": [["clever", "root"]]},
    "smart": {"p": "/smɑːt/", "parts": [["smart", "root"]]},
    "strong": {"p": "/strɒŋ/", "parts": [["strong", "root"]]},
    "strength": {"p": "/streŋθ/", "parts": [["streng", "root"], ["th", "suffix"]]},
    "health": {"p": "/helθ/", "parts": [["heal", "root"], ["th", "suffix"]]},
    "healthy": {"p": "/ˈhelθi/", "parts": [["heal", "root"], ["th", "suffix"], ["y", "suffix"]]},
    "unhealthy": {"p": "/ʌnˈhelθi/", "parts": [["un", "prefix"], ["heal", "root"], ["th", "suffix"], ["y", "suffix"]]},
    "knowledge": {"p": "/ˈnɒlɪdʒ/", "parts": [["know", "root"], ["ledge", "suffix"]]},
    "practice": {"p": "/ˈpræktɪs/", "parts": [["pract", "root"], ["ice", "suffix"]]},
    "future": {"p": "/ˈfjuːtʃə/", "parts": [["fut", "root"], ["ure", "suffix"]]},
    "success": {"p": "/səkˈses/", "parts": [["sub", "prefix"], ["cess", "root"]]},
    "successful": {"p": "/səkˈsesfl/", "parts": [["sub", "prefix"], ["cess", "root"], ["ful", "suffix"]]},
    "successfully": {"p": "/səkˈsesfəli/", "parts": [["sub", "prefix"], ["cess", "root"], ["ful", "suffix"], ["ly", "suffix"]]},
    "failure": {"p": "/ˈfeɪljə/", "parts": [["fail", "root"], ["ure", "suffix"]]}
}

phonetics_dict = {k: v["p"] for k, v in words_data.items()}
explicit_breakdowns = {k: v["parts"] for k, v in words_data.items()}

prefixes_list = [
    {"prefix": "un", "meaning": "不、相反 (unhappy, unable)"},
    {"prefix": "re", "meaning": "再、重复、回 (rewrite, rebuild, return)"},
    {"prefix": "in", "meaning": "不、向内 (invisible, inspect)"},
    {"prefix": "im", "meaning": "不 (impossible, impatient)"},
    {"prefix": "dis", "meaning": "不、除去 (disagree, disappear)"},
    {"prefix": "mis", "meaning": "错误、失误 (mistake, misunderstand)"},
    {"prefix": "pre", "meaning": "前、预先 (predict, preview)"},
    {"prefix": "pro", "meaning": "向前、赞成 (progress, protect)"},
    {"prefix": "sub", "meaning": "在下面、副 (subway, submarine)"},
    {"prefix": "trans", "meaning": "越过、转变 (transport, transform)"},
    {"prefix": "inter", "meaning": "相互、在……之间 (international, interact)"},
    {"prefix": "tele", "meaning": "远 (telephone, telescope)"},
    {"prefix": "auto", "meaning": "自动、自己 (automatic, autograph)"},
    {"prefix": "super", "meaning": "超级、在上方 (supermarket, superstar)"},
    {"prefix": "anti", "meaning": "抗、反 (antibiotic, antibody)"},
    {"prefix": "multi", "meaning": "多 (multimedia, multilingual)"},
    {"prefix": "bi", "meaning": "双、两 (bicycle, bilingual)"},
    {"prefix": "tri", "meaning": "三 (triangle, tricycle)"},
    {"prefix": "con", "meaning": "共同、加强 (construct, confirm)"},
    {"prefix": "com", "meaning": "共同、聚集 (combine, compare)"},
    {"prefix": "de", "meaning": "向下、除去 (destruct, degrade)"},
    {"prefix": "ex", "meaning": "向外、前 (export, extract)"},
    {"prefix": "non", "meaning": "非 (nonstop, nonsense)"},
    {"prefix": "over", "meaning": "过度、超过 (overcome, overheat)"},
    {"prefix": "under", "meaning": "在下、不足 (understand, underground)"}
]

roots_list = [
    {"root": "port", "meaning": "运、带 (carry: export, import, transport)"},
    {"root": "dict", "meaning": "说、言 (say/speak: predict, dictionary)"},
    {"root": "spect", "meaning": "看、视 (look/see: inspect, respect, perspective)"},
    {"root": "struct", "meaning": "构建、建筑 (build: construct, structure)"},
    {"root": "vis", "meaning": "看见 (see: visible, vision, supervise)"},
    {"root": "tract", "meaning": "拉、拽 (draw/pull: attract, contract)"},
    {"root": "form", "meaning": "形成、形状 (shape: reform, transform)"},
    {"root": "act", "meaning": "做、行动 (do/act: active, react, interact)"},
    {"root": "scrib", "meaning": "写 (write: describe, subscribe)"},
    {"root": "script", "meaning": "写好的本 (manuscript, description)"},
    {"root": "bio", "meaning": "生命 (life: biology, biography)"},
    {"root": "geo", "meaning": "地球、土地 (earth: geography, geology)"},
    {"root": "phon", "meaning": "声音 (sound: telephone, phonetics)"},
    {"root": "log", "meaning": "言语、学科 (study/word: dialogue, logic)"},
    {"root": "graph", "meaning": "画、写 (write/draw: photograph, autograph)"},
    {"root": "scope", "meaning": "观察器 (instrument: telescope, microscope)"},
    {"root": "cycl", "meaning": "环、圆 (circle: bicycle, cycle)"},
    {"root": "meter", "meaning": "测量、仪表 (measure: thermometer, kilometer)"},
    {"root": "pos", "meaning": "放、置 (put/place: compose, deposit)"},
    {"root": "press", "meaning": "压、挤 (press: express, impress)"},
    {"root": "rupt", "meaning": "断裂、破 (break: interrupt, corrupt)"},
    {"root": "sens", "meaning": "感觉 (feel: sense, sensitive)"},
    {"root": "vent", "meaning": "来、到 (come: event, prevent)"},
    {"root": "cess", "meaning": "行进、退走 (go: success, process)"}
]

suffixes_list = [
    {"suffix": "able", "type": "adj", "meaning": "能……的 (portable, predictable)"},
    {"suffix": "ible", "type": "adj", "meaning": "可……的 (visible, impossible)"},
    {"suffix": "ful", "type": "adj", "meaning": "充满……的 (careful, beautiful)"},
    {"suffix": "less", "type": "adj", "meaning": "无……的 (careless, hopeless)"},
    {"suffix": "ous", "type": "adj", "meaning": "具有……特征的 (dangerous, famous)"},
    {"suffix": "ive", "type": "adj", "meaning": "具有……性质的 (active, attractive)"},
    {"suffix": "al", "type": "adj", "meaning": "……的 (natural, international)"},
    {"suffix": "ly", "type": "adv", "meaning": "以……方式 (carefully, friendly)"},
    {"suffix": "ness", "type": "n", "meaning": "性质、状态 (happiness, darkness)"},
    {"suffix": "ment", "type": "n", "meaning": "行为、结果 (development, movement)"},
    {"suffix": "tion", "type": "n", "meaning": "动作、过程 (action, prediction)"},
    {"suffix": "sion", "type": "n", "meaning": "动作、状态 (decision, vision)"},
    {"suffix": "ation", "type": "n", "meaning": "过程、状态 (information, transformation)"},
    {"suffix": "er", "type": "n", "meaning": "做……的人 (teacher, worker, player)"},
    {"suffix": "or", "type": "n", "meaning": "……者、仪器 (doctor, visitor, actor)"},
    {"suffix": "ist", "type": "n", "meaning": "……家、主义者 (artist, scientist)"},
    {"suffix": "ship", "type": "n", "meaning": "关系、身份 (friendship, leadership)"},
    {"suffix": "ity", "type": "n", "meaning": "性质、状态 (activity, ability)"},
    {"suffix": "ance", "type": "n", "meaning": "状态、性质 (importance, performance)"},
    {"suffix": "ence", "type": "n", "meaning": "状态、性质 (silence, difference)"}
]

preset_word_groups = {
    "primary": {
        "name": "小学常用基础词",
        "words": ["apple", "banana", "cat", "dog", "bird", "fish", "duck", "book", "pencil", "ruler", "school", "teacher", "student", "father", "mother", "sister", "brother", "friend", "red", "blue", "green", "yellow", "sun", "moon", "star", "water", "milk", "bread", "happy", "smile"]
    },
    "junior": {
        "name": "初中中考核心词",
        "words": ["practice", "knowledge", "successful", "carefully", "difference", "education", "environment", "healthy", "important", "improve", "interest", "language", "memory", "natural", "possible", "protect", "remember", "science", "society", "technology", "together", "traditional", "understand", "valuable"]
    },
    "roots_port": {
        "name": "词根 port (携带/运输)",
        "words": ["port", "portable", "export", "import", "transport", "transportation", "porter", "passport", "report", "reporter", "support", "important", "importance"]
    },
    "roots_dict": {
        "name": "词根 dict (说/言)",
        "words": ["predict", "predictable", "unpredictable", "prediction", "contradict", "dictate", "dictation", "dictionary", "verdict"]
    },
    "roots_spect": {
        "name": "词根 spect (看/视)",
        "words": ["inspect", "inspection", "inspector", "respect", "respectful", "perspective", "prospect", "spectator", "suspect"]
    },
    "roots_struct": {
        "name": "词根 struct (建/构)",
        "words": ["structure", "construct", "construction", "reconstruct", "destruct", "destruction", "instruct", "instructor", "instruction"]
    },
    "roots_vis": {
        "name": "词根 vis (视/见)",
        "words": ["visible", "invisible", "vision", "visual", "visit", "visitor", "supervise", "supervisor", "revise", "revision"]
    },
    "roots_tract": {
        "name": "词根 tract (拉/拽)",
        "words": ["attract", "attractive", "attraction", "contract", "distract", "extract", "subtract", "tractor"]
    },
    "roots_form": {
        "name": "词根 form (形成/形)",
        "words": ["form", "inform", "information", "reform", "transform", "transformation", "conform", "perform", "performance", "uniform"]
    },
    "roots_act": {
        "name": "词根 act (做/行动)",
        "words": ["act", "action", "active", "activity", "actor", "react", "reaction", "interact", "interaction", "exact"]
    },
    "compounds": {
        "name": "经典复合词 (Compound)",
        "words": ["sunshine", "rainbow", "football", "basketball", "bookstore", "classroom", "bedroom", "homework", "blackboard", "sunflower", "watermelon", "butterfly", "seafood", "pancake"]
    }
}

preset_sentences = {
    "quotes": {
        "name": "励志哲理名言",
        "sentences": [
            "Practice makes perfect.",
            "Where there is a will, there is a way.",
            "Knowledge is power.",
            "A journey of a thousand miles begins with a single step.",
            "Time and tide wait for no man.",
            "Every cloud has a silver lining.",
            "Rome was not built in a day.",
            "Actions speak louder than words."
        ]
    },
    "classics": {
        "name": "经典课文美句",
        "sentences": [
            "Life is like a box of chocolates, you never know what you're gonna get.",
            "Stay hungry, stay foolish.",
            "Education is the most powerful weapon which you can use to change the world.",
            "To see a world in a grain of sand, and a heaven in a wild flower.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Live as if you were to die tomorrow. Learn as if you were to live forever."
        ]
    },
    "daily": {
        "name": "实用日常表达",
        "sentences": [
            "It is never too late to learn and improve yourself.",
            "Reading books makes a full man, conference a ready man, and writing an exact man.",
            "We should protect the environment and make our earth greener.",
            "Friendship brings sunshine and warmth to our everyday life.",
            "Hard work pays off, and diligence creates a bright future."
        ]
    }
}

content = f"""// 英语字帖数据字典库：包含音标映射、词根词缀词库、预设单词与预设文章
export const ENGLISH_PHONETICS = {json.dumps(phonetics_dict, ensure_ascii=False, indent=2)};

export const EXPLICIT_BREAKDOWNS = {json.dumps(explicit_breakdowns, ensure_ascii=False, indent=2)};

export const PREFIXES_LIST = {json.dumps(prefixes_list, ensure_ascii=False, indent=2)};

export const ROOTS_LIST = {json.dumps(roots_list, ensure_ascii=False, indent=2)};

export const SUFFIXES_LIST = {json.dumps(suffixes_list, ensure_ascii=False, indent=2)};

export const PRESET_WORD_GROUPS = {json.dumps(preset_word_groups, ensure_ascii=False, indent=2)};

export const PRESET_SENTENCES = {json.dumps(preset_sentences, ensure_ascii=False, indent=2)};
"""

with open("english-data.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Generated english-data.js successfully.")
