hp = 20
gp = 0
dice = 0
x = '-'
dmg = 0
explore = false
exploreb = false
shop = false
shopb = false
fight = false
fightb = false
useitemmenu = false
potioninuse = false
potionusable = false
shieldusable = false
potionsend = false
sfxselectmode = new Audio('select.wav')
sfxbuy = new Audio('buy.mp3')
sfxdiceroll = new Audio ('diceroll.mp3')
sfxuse = new Audio ('use.mp3')
sfxwin = new Audio ('win.mp3')
itemlist = ['rope', 'caltrops', 'shield', 'potion', 'sword', 'armor']
items = [0, 0, 0, 0, false, false]
monsters = [ ['Pit Trap', 3], ['Skeleton', 2, 2, 1], ['Goblin', 3, 2, 2], ['Wraith', 5, 2, 4], ['Ogre', 4, 4, 7], ['Demon', 4, 6, 10] ]
pricelist = {'rope':2, 'caltrops':2, 'shield':3, 'potion':4, 'sword':5, 'armor':10}

function roll() {
    sfxdiceroll.load()
    sfxdiceroll.play()
    dice = Math.ceil(Math.random()*6)
    dicetext = document.querySelector('.dicetext')
    dicetext.innerHTML = String(dice)
    if (explore) {
        monster = monsters[dice - 1]
        if (dice == 1) {
            x = '-'
            hp -= 3
            dmg = 3
            if (hp <= 0) {
                lose()
            } else {
                refreshtext()
            }
            explore = false
            buttons(true)
            document.querySelector('.rollbutton').style.display = 'none'
            refreshuse()
        } else {
            x = monsters[dice - 1][1]
            explore = false
            fight = true
            buttons(false)
            shieldusable = false
            refreshuse()
            document.querySelector('.cs').innerHTML = '(Fighting)'
        }
        document.querySelector('.cetext').innerHTML = `${String(monsters[dice - 1][0])} (${String(x)})`
    } else if (fight) {
        if (items[4]) {
            x -= 1
            dicetext.innerHTML = String(dice) + '+1'
        }
        if (dice > x) {
            fight = false
            gold(monster[3])
            buttons(true)
            document.querySelector('.rollbutton').style.display = 'none'
            document.querySelector('.cs').innerHTML = '(?)'
            monster = '?'
            refreshuse()
        } else {
            if (items[5]) {
                damage(monster[2] - 1)
            } else {
                damage(monster[2])
            }
            shieldusable = true
            refreshuse()
        }
    } else if (potioninuse) {
        damage(-dice)
        diceb = dice
        potioninuse = false
        if (shopb == true) {
            buttons(true)
            potionsend = true
            openshop()
            refreshshop()
            if (unbuyableitems >= 6) {
                fight = false
                shop = false
                explore = false
                buttons(true)
                document.querySelector('.rollbutton').style.display = 'none'
                document.querySelector('.cs').innerHTML = '(?)'
            }
        } else if (fightb == true) {
            fight = true
            document.querySelector('.cs').innerHTML = '(Fighting)'
            monster = monsterb
        } else if (exploreb == true) {
            buttons(true)
            potionsend = true
            exploremode()
            document.querySelector('.dicetext').innerHTML = diceb
        }
        if (items[3] > 0) {
            potionusable = true
        }
    }
}

function use(item) {
    sfxuse.load()
    sfxuse.play()
    items[itemlist.indexOf(item)] -= 1
    if (item == 'rope') {
        damage(-3)
        monster = '?'
        refreshuse()
    }
    if (item == 'caltrops') {
        fight = false
        buttons(true)
        document.querySelector('.rollbutton').style.display = 'none'
        document.querySelector('.cs').innerHTML = '(?)'
    }
    if (item == 'shield') {
        damage(-dmg)
        monster = '?'
        refreshuse()
    }
    if (item == 'potion') {
        potionusable = false
        potioninuse = true
        fightb = fight
        exploreb = explore
        shopb = shop
        fight = false
        explore = false
        monsterb = monster
        buttons(false)
        monster = '?'
        refreshuse()
        document.querySelector('.cs').innerHTML = '(Rolling for Potion)'
        document.querySelector('.rollbutton').style.display = 'block'
        document.querySelector('.sbns').style.display = 'none'
    }
    refreshuse()
}

function openuse() {
    useitemmenu = (useitemmenu) ? false : true
    usestdisplay = (useitemmenu) ? 'flex' : 'none'
    document.querySelector('.ubns').style.display = usestdisplay
}

function exploremode() {
    if (!potionsend) {
        sfxselectmode.load()
        sfxselectmode.play()
    }
    useitemmenu = false
    shop = false
    explore = true
    monster = '?'
    refreshuse()
    document.querySelector('.ubns').style.display = 'none'
    document.querySelector('.rollbutton').style.display = 'block'
    document.querySelector('.cetext').innerHTML = '?'
    document.querySelector('.dicetext').innerHTML = '?'
    document.querySelector('.cs').innerHTML = '(Exploring)'
    document.querySelector('.sbns').style.display = 'none'
}

function openshop() {
    if (!potionsend) {
        sfxselectmode.load()
        sfxselectmode.play()
    }
    useitemmenu = false
    explore = false
    shop = true
    monster = '?'
    refreshuse()
    document.querySelector('.ubns').style.display = 'none'
    document.querySelector('.rollbutton').style.display = 'none'
    document.querySelector('.cs').innerHTML = '(Shopping)'
    document.querySelector('.sbns').style.display = 'flex'
}

function buttons(enabled) {
    stdisplay = (enabled) ? 'block' : 'none'
    document.querySelector('#explorebutton').style.display = stdisplay
    document.querySelector('#shopbutton').style.display = stdisplay
    if (enabled) {
        refreshshop()
    }
}

function lose() {
    document.querySelectorAll('.txt').forEach(function displaylose(element) {
        element.style.display = 'none'
    })
    document.querySelector('h1').innerHTML = 'You Lose!'
    document.querySelector('h1').style.color = 'rgb(255, 31, 31)'
    document.querySelector('.gpheader').innerHTML = `GP (Gold): ${String(gp)}`
}

function win() {
    document.querySelectorAll('.txt').forEach(function displaylose(element) {
        element.style.display = 'none'
    })
    document.querySelector('h1').innerHTML = 'You Win!'
    document.querySelector('h1').style.color = 'rgb(25, 170, 8)'
    document.querySelector('.gpheader').innerHTML = `GP (Gold): ${String(gp)}`
    sfxwin.load()
    sfxwin.play()
}

function refreshtext() {
    document.querySelector('.hptext').innerHTML = String(hp)
    document.querySelector('.gptext').innerHTML = String(gp)
}

function damage(amount) {
    hp -= amount
    dmg = amount
    refreshtext()
    if (hp <= 0) {
        lose()
    } else if (hp > 20) {
        hp = 20
        refreshtext()
    }
}

function gold(amount) {
    gp += amount
    if (gp >= 50) {
        win()
    } else if (gp < 0) {
        gp = 0
        refreshtext()
    } else {
        refreshtext()
    }
}

function buy(item) {
    gp -= eval(`pricelist.${item}`)
    sfxbuy.load()
    sfxbuy.play()
    refreshtext()
    if (itemlist.indexOf(item) > 3) {
        items[itemlist.indexOf(item)] = true
    } else {
        items[itemlist.indexOf(item)] += 1
    }
    if (item == 'potion') {
        potionusable = true
    }
    refreshshop()
    if (unbuyableitems >= 6) {
        fight = false
        shop = false
        explore = false
        buttons(true)
        document.querySelector('.rollbutton').style.display = 'none'
        document.querySelector('.cs').innerHTML = '(?)'
    }
    refreshuse()
}

function refreshshop() {
    document.querySelector('#shopbutton').style.display = 'block'
    unbuyableitems = 0
    document.querySelectorAll('.sbn').forEach(function buyable(element) {
        if (gp < eval(`pricelist.${element.id}`)) {
            element.style.display = 'none'
            unbuyableitems += 1
        } else {
            element.style.display = 'block'
        }
        if (itemlist.indexOf(element.id) > 3 && items[itemlist.indexOf(element.id)]) {
            element.style.display = 'none'
            unbuyableitems += 1
        }
    })
    if (unbuyableitems >= 6) {
        document.querySelector('.sbns').style.display = 'none'
        document.querySelector('#shopbutton').style.display = 'none'
    }
}

function refreshuse() {
    document.querySelector('#usebutton').style.display = 'block'
    unusableitems = 0
    document.querySelectorAll('.ubn').forEach(function checkifusable(element) {
        usable = (items[itemlist.indexOf(element.id)] > 0)
        useitemstdisplay = (usable) ? 'block' : 'none'
        element.style.display = useitemstdisplay
        unusableitems += (usable) ? 0 : 1
        if (element.id == 'rope' && monster[0] != 'Pit Trap' && usable) {
            element.style.display = 'none'
            unusableitems += 1
        }
        if (element.id == 'caltrops' && (monster[0] == 'Pit Trap' || monster == '?') && usable) {
            element.style.display = 'none'
            unusableitems += 1
        }
        if (element.id == 'shield' && (monster == '?' || shieldusable == false) && usable) {
            element.style.display = 'none'
            unusableitems += 1
        }
        if (element.id == 'potion' && !potionusable && usable) {
            element.style.display = 'none'
            unusableitems += 1
        }
    })
    if (unusableitems >= 4) {
        document.querySelector('.ubns').style.display = 'none'
        document.querySelector('#usebutton').style.display = 'none'
    }
}

